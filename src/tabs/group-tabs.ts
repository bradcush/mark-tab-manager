import { logVerbose } from 'src/logs/console';
import {
    ActiveTabIdsByWindowId,
    GroupFormat,
    TabCollectionItem,
    TabIdsByGroup,
} from './tabs-types';
import { getPersistedStore } from 'src/storage/persisted-store-instance';
import { tabGroupsQuery } from 'src/infra/browser/tab-groups/query';
import { getColorFromIndex } from 'src/infra/business/tab-groups/get-color-from-index';
import { makeTabIdsByGroup } from './make-tabids-by-group';
import { tabGroupsRender } from 'src/infra/business/tab-groups/render';

/**
 * Get all the active tabs across all windows
 */
function getActiveTabIdsByWindowId(tabs: chrome.tabs.Tab[]) {
    logVerbose('getActiveTabIdsByWindowId');
    const activeTabs = tabs.filter((tab) => tab.active);
    return activeTabs.reduce<ActiveTabIdsByWindowId>(
        (acc, { id, windowId }) => {
            acc.set(windowId, id);
            return acc;
        },
        new Map<number, number | undefined>(),
    );
}

/**
 * Check if a tab in a group is active
 */
function isActiveTabInGroup(groupIds: number[], activeTabId?: number) {
    // When the active tab for the window is
    // undefined it can't be in the group
    return typeof activeTabId !== 'undefined'
        ? groupIds.includes(activeTabId)
        : false;
}

/**
 * Check if a tab has been created but not focused because a link
 * was opened in a new tab and the opening tab retained focus
 */
function isUnfocusedGroupTab(groupIds: number[], updatedTabId?: number) {
    return typeof updatedTabId !== 'undefined'
        ? groupIds.includes(updatedTabId)
        : false;
}

/**
 * Create the title string to be used
 * for a give tab group name
 */
async function makeTitle(groupName: string, tabIds: number[]) {
    const { showGroupTabCount } = await getPersistedStore().getState();
    // We need to get the state before resetting groups using the
    // exact name. As a repercussion of this method, groups where the
    // count has changed are automatically reopened. This shouldn't
    // reopen groups that are collapsed as the user experience for a
    // collapsed group prevents the user from removing a tab.
    return showGroupTabCount ? `(${tabIds.length}) ${groupName}` : groupName;
}

/**
 * Get the current properties for a group with
 * a given name for a specific window id
 */
async function getGroupInfo(windowId: number, name: string) {
    logVerbose('getGroupInfo', name);
    // Be careful of the title as query titles are patterns where
    // chars can have special meaning (eg. * is a universal selector)
    const queryInfo = { title: name, windowId };
    const tabGroups = await tabGroupsQuery(queryInfo);
    logVerbose('getGroupInfo', tabGroups);
    return tabGroups[0];
}

/**
 * Makes groups and non-groups using their tab id where
 * groups must contain at least two or more tabs
 */
async function makeTabCollection(
    activeTabIdsByWindowId: ActiveTabIdsByWindowId,
    tabIdsByGroup: TabIdsByGroup,
    format: GroupFormat,
    updatedTab?: chrome.tabs.Tab,
) {
    logVerbose('makeTabCollection', tabIdsByGroup);
    let isolatedGroupCount = 0;
    const names = Object.keys(tabIdsByGroup);
    const tabCollection: TabCollectionItem[] = [];
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        logVerbose('makeTabCollection', name);
        const windowIds = Object.keys(tabIdsByGroup[name]);
        // Order is determined by the browser based on the location of the
        // first tab in the group so we can handle grouping in any order.
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        for (const windowKey of windowIds) {
            // Groups are represented by the window id
            const tabIds = tabIdsByGroup[name][windowKey];
            if (tabIds.length < 2) {
                isolatedGroupCount++;
                const action = 'ungroup';
                tabCollection.push({
                    action,
                    tabIds,
                });
                continue;
            }
            // Only real groups should be considered
            // to have a sequential color order
            const colorIndex = i - isolatedGroupCount;
            const color = getColorFromIndex(colorIndex);
            const windowId = Number(windowKey);
            const activeTabId = activeTabIdsByWindowId.get(windowId);
            const isActiveGroup =
                isActiveTabInGroup(tabIds, activeTabId) ||
                isUnfocusedGroupTab(tabIds, updatedTab?.id);
            const title = await makeTitle(name, tabIds);
            const prevGroup = await getGroupInfo(windowId, title);
            // Keep existing groups as they were unless previously closed as
            // we may need to open a group to handle a newly created tab
            const isMarkedOpen = !prevGroup?.collapsed || isActiveGroup;
            const opened = format === 'collapse' ? isActiveGroup : isMarkedOpen;
            logVerbose('makeTabCollection', color, title);
            const action = 'group';
            tabCollection.push({
                action,
                color,
                opened,
                title,
                tabIds,
                windowId,
            });
        }
    }
    logVerbose('makeTabCollection', tabCollection);
    return tabCollection;
}

/**
 * Group tabs in the browser
 */
export async function groupTabs(
    format: GroupFormat,
    tabsToRender: chrome.tabs.Tab[],
    newTab?: chrome.tabs.Tab,
): Promise<void> {
    logVerbose('groupTabs', format);
    const activeTabIdsByWindowId = getActiveTabIdsByWindowId(tabsToRender);
    const tabIdsByGroup = await makeTabIdsByGroup(tabsToRender);
    const tabCollection = await makeTabCollection(
        activeTabIdsByWindowId,
        tabIdsByGroup,
        format,
        newTab,
    );
    void tabGroupsRender(tabCollection);
}
