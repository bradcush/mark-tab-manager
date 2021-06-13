import {
    MkActiveTabIdsByWindow,
    MkActiveTabIdsByWindowKey,
    MkActiveTabIdsByWindowValue,
    MkAddNewGroupParams,
    MkGetGroupInfoParams,
    MkRender,
    MkRenderGroupsByNameParams,
    MkUpdateGroupTitleParams,
} from './MkGroup';
import { MkBrowser } from 'src/api/MkBrowser';
import { isSupported as isTabGroupsUpdateSupported } from 'src/api/browser/tabGroups/update';
import { isSupported as isTabGroupsQuerySupported } from 'src/api/browser/tabGroups/query';
import { isSupported as isTabsGroupSupported } from 'src/api/browser/tabs/group';
import { isSupported as isTabsUngroupSupported } from 'src/api/browser/tabs/ungroup';
import { browser } from 'src/api/browser';
import { logError, logVerbose } from 'src/logs/console';
import { getStore } from 'src/storage/Store';
import { categorize as categorizeTabs } from './categorize';

/**
 * Add new tab groups for a given name,
 * window id, and set of tab ids
 */
async function addNewGroup({
    idx,
    forceCollapse,
    name,
    tabIds,
    windowId,
}: MkAddNewGroupParams) {
    try {
        logVerbose('addNewGroup', name, windowId);
        const { showGroupTabCount } = await getStore().getState();
        // We need to get the state before resetting groups using the
        // exact name. As a repercussion of this method, groups where the
        // count has changed are automatically reopened. This shouldn't
        // reopen groups that are collapsed as the user experience for a
        // collapsed group prevents the user from removing a tab.
        const title = showGroupTabCount ? `(${tabIds.length}) ${name}` : name;
        const prevGroup = await getGroupInfo({
            id: windowId,
            title,
        });
        const createProperties = { windowId };
        const options = { createProperties, tabIds };
        const groupId = await browser.tabs.group(options);
        const color = getColorForGroup(idx);
        // Rely on the previous state when we don't force
        const collapsed = (forceCollapse || prevGroup?.collapsed) ?? false;
        void updateGroupProperties({
            collapsed,
            color,
            groupId,
            title,
        });
    } catch (error) {
        logError('addNewGroup', error);
        throw error;
    }
}

/**
 * Get all the active tabs across all windows
 */
function getActiveTabIdsByWindow(tabs: MkBrowser.tabs.Tab[]) {
    logVerbose('getActiveTabIdsByWindow');
    const activeTabs = tabs.filter((tab) => tab.active);
    // Best to use domain specific typings here
    const activeTabIdsByWindow: MkActiveTabIdsByWindow = new Map<
        MkActiveTabIdsByWindowKey,
        MkActiveTabIdsByWindowValue
    >();
    activeTabs.forEach(({ id, windowId }) => {
        activeTabIdsByWindow.set(windowId, id);
    });
    logVerbose('getActiveTabIdsByWindow', activeTabIdsByWindow);
    return activeTabIdsByWindow;
}

/**
 * Get the color based on each index so that each index will
 * retain the same color regardless of a group re-render
 */
function getColorForGroup(index: number) {
    logVerbose('getColorForGroup', index);
    const colorsByEnum = browser.tabGroups.Color;
    logVerbose('getColorForGroup', colorsByEnum);
    const colorKeys = Object.keys(colorsByEnum);
    const colors = colorKeys.map((colorKey) => colorKey.toLocaleLowerCase());
    const colorIdx = index % colorKeys.length;
    const color = colors[colorIdx];
    logVerbose('getColorForGroup', color);
    return color;
}

/**
 * Get the current properties for a group with
 * a given name for a specific window id
 */
async function getGroupInfo({ id, title }: MkGetGroupInfoParams) {
    try {
        logVerbose('getGroupInfo', title);
        // Be careful of the title as query titles are patterns where
        // chars can have special meaning (eg. * is a universal selector)
        const queryInfo = { title, windowId: id };
        const tabGroups = await browser.tabGroups.query(queryInfo);
        logVerbose('getGroupInfo', tabGroups);
        return tabGroups[0];
    } catch (error) {
        logError('getGroupInfo', error);
        throw error;
    }
}

/**
 * Should we group items based on support
 * and whether the feature is activated
 */
export async function isEnabled(): Promise<boolean> {
    logVerbose('isEnabled');
    const { enableAutomaticGrouping } = await getStore().getState();
    return isSupported() && enableAutomaticGrouping;
}

/**
 * Check if all used tab grouping APIs are supported
 */
export function isSupported(): boolean {
    logVerbose('isSupported');
    return (
        isTabGroupsUpdateSupported() &&
        isTabGroupsQuerySupported() &&
        isTabsGroupSupported() &&
        isTabsUngroupSupported()
    );
}

/**
 * Remove all existing groups
 */
export async function remove(): Promise<void> {
    try {
        logVerbose('remove');
        const tabs = await browser.tabs.query({});
        const filterIds = (id: number | undefined): id is number =>
            typeof id !== 'undefined';
        const ids = tabs.map((tab) => tab.id).filter(filterIds);
        void removeGroupsForTabIds(ids);
    } catch (error) {
        logError('remove', error);
        throw error;
    }
}

/**
 * Remove a list of tabs from any group
 * and the group itself when empty
 */
async function removeGroupsForTabIds(ids: number[]) {
    try {
        logVerbose('removeGroupsForTabIds', ids);
        await browser.tabs.ungroup(ids);
    } catch (error) {
        logError('removeGroupsForTabIds', error);
        throw error;
    }
}

/**
 * Set groups and non-groups using their tab id where
 * groups must contain at least two or more tabs
 */
function renderGroupsByName({
    activeTabIdsByWindow,
    tabIdsByGroup,
    type,
}: MkRenderGroupsByNameParams) {
    logVerbose('renderGroupsByName', tabIdsByGroup);
    // Offset the index to ignore orphan groups
    let groupIdxOffset = 0;
    const names = Object.keys(tabIdsByGroup);
    names.forEach((name, idx) => {
        logVerbose('renderGroupsByName', name);
        // Groups are represented by the window id
        const group = Object.keys(tabIdsByGroup[name]);
        const isRealGroup = (windowId: string) =>
            tabIdsByGroup[name][windowId].length > 1;
        const realGroups = group.filter(isRealGroup);
        const orphanGroups = group.filter((group) => !isRealGroup(group));
        // We treat real groups first so our index used to
        // determine the color isn't affected by orphan groups
        [...realGroups, ...orphanGroups].forEach((windowGroup) => {
            const tabIds = tabIdsByGroup[name][windowGroup];
            // Ungroup existing collections of one tab
            if (tabIds.length < 2) {
                void removeGroupsForTabIds(tabIds);
                groupIdxOffset++;
                return;
            }
            const groupIdx = idx - groupIdxOffset;
            const windowId = Number(windowGroup);
            // Does this group contain an active tab
            const activeTabId = activeTabIdsByWindow.get(windowId);
            // Collapse non-active groups
            const forceCollapse =
                type === 'collapse'
                    ? // When the active tab for the window is
                      // undefined it can't be in the group
                      typeof activeTabId !== 'undefined'
                        ? !tabIds.includes(activeTabId)
                        : true
                    : false;
            logVerbose('renderGroupsByName', activeTabId);
            void addNewGroup({
                idx: groupIdx,
                forceCollapse,
                name,
                tabIds,
                windowId,
            });
        });
    });
}

/**
 * Group tabs in the browser
 */
export async function render({ organizeType, tabs }: MkRender): Promise<void> {
    try {
        logVerbose('render');
        const activeTabIdsByWindow = getActiveTabIdsByWindow(tabs);
        const categorizedTabs = await categorizeTabs(tabs);
        renderGroupsByName({
            activeTabIdsByWindow,
            tabIdsByGroup: categorizedTabs,
            type: organizeType,
        });
    } catch (error) {
        logError('render', error);
        throw error;
    }
}

/**
 * Update an existing groups title
 */
async function updateGroupProperties({
    collapsed,
    color,
    groupId,
    title,
}: MkUpdateGroupTitleParams) {
    try {
        logVerbose('updateGroupProperties', color);
        const updateProperties = { collapsed, color, title };
        await browser.tabGroups.update(groupId, updateProperties);
    } catch (error) {
        logError('updateGroupProperties', error);
        throw error;
    }
}
