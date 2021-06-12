import {
    MkActiveTabIdsByWindow,
    MkActiveTabIdsByWindowKey,
    MkActiveTabIdsByWindowValue,
    MkAddNewGroupParams,
    MkGetGroupInfoParams,
    MkGrouper,
    MkRender,
    MkRenderGroupsByNameParams,
    MkTabIdsByGroup,
    MkUpdateGroupTitleParams,
} from './MkGrouper';
import { MkBrowser } from 'src/api/MkBrowser';
import { isSupported as isTabGroupsUpdateSupported } from 'src/api/browser/tabGroups/update';
import { isSupported as isTabGroupsQuerySupported } from 'src/api/browser/tabGroups/query';
import { isSupported as isTabsGroupSupported } from 'src/api/browser/tabs/group';
import { isSupported as isTabsUngroupSupported } from 'src/api/browser/tabs/ungroup';
import { makeGroupName } from 'src/helpers/groupName';
import { browser } from 'src/api/browser';
import { logError, logVerbose } from 'src/logs/console';
import { getStore } from 'src/storage/Store';

/**
 * Grouping and ungrouping of tabs
 */
export class Grouper implements MkGrouper {
    public constructor() {
        logVerbose('constructor');
    }

    /**
     * Add new tab groups for a given name,
     * window id, and set of tab ids
     */
    private async addNewGroup({
        idx,
        forceCollapse,
        name,
        tabIds,
        windowId,
    }: MkAddNewGroupParams) {
        logVerbose('addNewGroup', name, windowId);
        try {
            const { showGroupTabCount } = await getStore().getState();
            // We need to get the state before resetting groups using the
            // exact name. As a repercussion of this method, groups where the
            // count has changed are automatically reopened. This shouldn't
            // reopen groups that are collapsed as the user experience for a
            // collapsed group prevents the user from removing a tab.
            const title = showGroupTabCount
                ? `(${tabIds.length}) ${name}`
                : name;
            const prevGroup = await this.getGroupInfo({
                id: windowId,
                title,
            });
            const createProperties = { windowId };
            const options = { createProperties, tabIds };
            const groupId = await browser.tabs.group(options);
            const color = this.getColorForGroup(idx);
            // Rely on the previous state when we don't force
            const collapsed = (forceCollapse || prevGroup?.collapsed) ?? false;
            void this.updateGroupProperties({
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
    private getActiveTabIdsByWindow(tabs: MkBrowser.tabs.Tab[]) {
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
    private getColorForGroup(index: number) {
        logVerbose('getColorForGroup', index);
        const colorsByEnum = browser.tabGroups.Color;
        logVerbose('getColorForGroup', colorsByEnum);
        const colorKeys = Object.keys(colorsByEnum);
        const colors = colorKeys.map((colorKey) =>
            colorKey.toLocaleLowerCase()
        );
        const colorIdx = index % colorKeys.length;
        const color = colors[colorIdx];
        logVerbose('getColorForGroup', color);
        return color;
    }

    /**
     * Get the current properties for a group with
     * a given name for a specific window id
     */
    private async getGroupInfo({ id, title }: MkGetGroupInfoParams) {
        logVerbose('getGroupInfo', title);
        try {
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
    public async isEnabled(): Promise<boolean> {
        logVerbose('isEnabled');
        const isSupported = this.isSupported();
        const { enableAutomaticGrouping } = await getStore().getState();
        return isSupported && enableAutomaticGrouping;
    }

    /**
     * Check if all used tab grouping APIs are supported
     */
    public isSupported(): boolean {
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
    public async remove(): Promise<void> {
        logVerbose('remove');
        try {
            const tabs = await browser.tabs.query({});
            const filterIds = (id: number | undefined): id is number =>
                typeof id !== 'undefined';
            const ids = tabs.map((tab) => tab.id).filter(filterIds);
            void this.removeGroupsForTabIds(ids);
        } catch (error) {
            logError('remove', error);
            throw error;
        }
    }

    /**
     * Remove a list of tabs from any group
     * and the group itself when empty
     */
    private async removeGroupsForTabIds(ids: number[]) {
        logVerbose('removeGroupsForTabIds', ids);
        try {
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
    private renderGroupsByName({
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
                    void this.removeGroupsForTabIds(tabIds);
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
                void this.addNewGroup({
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
    public render({ groups, organizeType, tabs }: MkRender): void {
        logVerbose('render');
        const activeTabIdsByWindow = this.getActiveTabIdsByWindow(tabs);
        this.renderGroupsByName({
            activeTabIdsByWindow,
            tabIdsByGroup: groups,
            type: organizeType,
        });
    }

    /**
     * Group tabs by their group name and window id
     */
    public async group(tabs: MkBrowser.tabs.Tab[]): Promise<MkTabIdsByGroup> {
        logVerbose('group');
        const {
            enableSubdomainFiltering,
            forceWindowConsolidation,
        } = await getStore().getState();
        // Not using "chrome.windows.WINDOW_ID_CURRENT" as we rely on real
        // "windowId" in our algorithm which the representative -2 breaks
        const staticWindowId = tabs[0].windowId;
        const tabIdsByGroup = tabs.reduce<MkTabIdsByGroup>((acc, tab) => {
            const { id, url, windowId } = tab;
            if (!id) {
                throw new Error('No id for tab');
            }
            // Don't group tabs without a URL
            if (!url) {
                throw new Error('No tab url');
            }
            const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
            const groupName = makeGroupName({ type: groupType, url });
            // Specify the current window as the forced window
            const chosenWindowId = forceWindowConsolidation
                ? staticWindowId
                : windowId;
            if (!acc[groupName]) {
                acc[groupName] = {
                    [chosenWindowId]: [id],
                };
            } else if (!acc[groupName][chosenWindowId]) {
                acc[groupName] = {
                    ...acc[groupName],
                    [chosenWindowId]: [id],
                };
            } else {
                acc[groupName][chosenWindowId].push(id);
            }
            return acc;
        }, {});
        logVerbose('group', tabIdsByGroup);
        return tabIdsByGroup;
    }

    /**
     * Update an existing groups title
     */
    private async updateGroupProperties({
        collapsed,
        color,
        groupId,
        title,
    }: MkUpdateGroupTitleParams) {
        logVerbose('updateGroupProperties', color);
        try {
            const updateProperties = { collapsed, color, title };
            await browser.tabGroups.update(groupId, updateProperties);
        } catch (error) {
            logError('updateGroupProperties', error);
            throw error;
        }
    }
}
