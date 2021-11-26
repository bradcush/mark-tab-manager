import {
    MkActiveTabIdsByWindow,
    MkActiveTabIdsByWindowKey,
    MkActiveTabIdsByWindowValue,
    MkRender,
    MkRenderGroupsByNameParams,
} from './MkGroup';
import { isSupported as isTabGroupsUpdateSupported } from 'src/api/browser/tabGroups/update';
import { isSupported as isTabGroupsQuerySupported } from 'src/api/browser/tabGroups/query';
import { isSupported as isTabsGroupSupported } from 'src/api/browser/tabs/group';
import { isSupported as isTabsUngroupSupported } from 'src/api/browser/tabs/ungroup';
import { logError, logVerbose } from 'src/logs/console';
import { getStore } from 'src/storage/Store';
import { categorize as categorizeTabs } from './categorize';
import { group as groupTabs, ungroup as ungroupTabs } from './bar';

/**
 * Get all the active tabs across all windows
 * TODO: Use typings specific to group domain
 */
function getActiveTabIdsByWindow(tabs: chrome.tabs.Tab[]) {
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
                void ungroupTabs(tabIds);
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
            void groupTabs({
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
