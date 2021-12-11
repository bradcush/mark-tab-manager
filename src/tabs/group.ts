import {
    MkActiveTabIdsByWindow,
    MkActiveTabIdsByWindowKey,
    MkActiveTabIdsByWindowValue,
    MkGetGroupInfoParams,
    MkMakeTitleParams,
    MkRender,
    MkRenderGroupsByNameParams,
} from './MkGroup';
import { MkOrganizationTab } from './MkOrganize';
import { isSupported as isTabGroupsUpdateSupported } from 'src/api/browser/tabGroups/update';
import {
    isSupported as isTabGroupsQuerySupported,
    query as tabGroupsQuery,
} from 'src/api/browser/tabGroups/query';
import { isSupported as isTabsGroupSupported } from 'src/api/browser/tabs/group';
import { isSupported as isTabsUngroupSupported } from 'src/api/browser/tabs/ungroup';
import { getColor as getTabGroupsColor } from 'src/api/browser/tabGroups/constants/Color';
import { logVerbose } from 'src/logs/console';
import { getStore } from 'src/storage/Store';
import { categorize as categorizeTabs } from './categorize';
import { group as groupTabs, ungroup as ungroupTabs } from './bar';

/**
 * Get all the active tabs across all windows
 */
function getActiveTabIdsByWindow(tabs: MkOrganizationTab[]) {
    logVerbose('getActiveTabIdsByWindow');
    const activeTabs = tabs.filter((tab) => tab.active);
    // Best to use domain specific typings here
    const activeTabIdsByWindow = activeTabs.reduce<MkActiveTabIdsByWindow>(
        (acc, { id, windowId }) => {
            acc.set(windowId, id);
            return acc;
        },
        new Map<MkActiveTabIdsByWindowKey, MkActiveTabIdsByWindowValue>()
    );
    logVerbose('getActiveTabIdsByWindow', activeTabIdsByWindow);
    return activeTabIdsByWindow;
}

/**
 * Get the color based on each index so that each index will
 * retain the same color regardless of a group re-render
 */
function getColorForGroup(index: number) {
    logVerbose('getColorForGroup', index);
    const colorsByEnum = getTabGroupsColor();
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
    logVerbose('getGroupInfo', title);
    // Be careful of the title as query titles are patterns where
    // chars can have special meaning (eg. * is a universal selector)
    const queryInfo = { title, windowId: id };
    const tabGroups = await tabGroupsQuery(queryInfo);
    logVerbose('getGroupInfo', tabGroups);
    return tabGroups[0];
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
 * Create the title string to be used
 * for a give tab group name
 */
async function makeTitle({ groupName, ids }: MkMakeTitleParams) {
    const { showGroupTabCount } = await getStore().getState();
    // We need to get the state before resetting groups using the
    // exact name. As a repercussion of this method, groups where the
    // count has changed are automatically reopened. This shouldn't
    // reopen groups that are collapsed as the user experience for a
    // collapsed group prevents the user from removing a tab.
    return showGroupTabCount ? `(${ids.length}) ${groupName}` : groupName;
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
    let orphanGroupCount = 0;
    const names = Object.keys(tabIdsByGroup);
    names.forEach((name, idx) => {
        logVerbose('renderGroupsByName', name);
        const group = Object.keys(tabIdsByGroup[name]);
        // Order is determined by the browser based on the location of the
        // first tab in the group so we can handle grouping in any order.
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        group.forEach(async (windowGroup) => {
            // Groups are represented by the window id
            const tabIds = tabIdsByGroup[name][windowGroup];
            // Ungroup existing collections of one tab
            if (tabIds.length < 2) {
                void ungroupTabs(tabIds);
                orphanGroupCount++;
                return;
            }
            // Only real groups should be considered
            // to have a sequential color order
            const colorIndex = idx - orphanGroupCount;
            const color = getColorForGroup(colorIndex);
            const windowId = Number(windowGroup);
            const activeTabId = activeTabIdsByWindow.get(windowId);
            // Does this group contain an active tab
            const isGroupActive =
                // When the active tab for the window is
                // undefined it can't be in the group
                typeof activeTabId !== 'undefined' &&
                tabIds.includes(activeTabId);
            const title = await makeTitle({
                groupName: name,
                ids: tabIds,
            });
            const prevGroup = await getGroupInfo({
                id: windowId,
                title,
            });
            const opened =
                type === 'collapse'
                    ? isGroupActive
                    : // Keep existing groups as they were unless
                      // previously closed as we may need to open a
                      // group to accommodate a newly created tab.
                      !prevGroup?.collapsed || isGroupActive;
            logVerbose('addNewGroup', color, title);
            void groupTabs({
                color,
                opened,
                title,
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
    logVerbose('render');
    const activeTabIdsByWindow = getActiveTabIdsByWindow(tabs);
    const categorizedTabs = await categorizeTabs(tabs);
    renderGroupsByName({
        activeTabIdsByWindow,
        tabIdsByGroup: categorizedTabs,
        type: organizeType,
    });
}
