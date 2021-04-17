import {
    MkActiveTabIdsByWindow,
    MkActiveTabIdsByWindowKey,
    MkActiveTabIdsByWindowValue,
    MkAddNewGroupParams,
    MkContstructorParams,
    MkGetGroupInfoParams,
    MkGrouper,
    MkGrouperBrowser,
    MkRenderGroupsByNameParams,
    MkRenderTabGroups,
    MkTabIdsByGroup,
    MkUpdateGroupTitleParams,
} from './MkGrouper';
import { MkStore } from 'src/storage/MkStore';
import { MkLogger } from 'src/logs/MkLogger';
import { MkBrowser } from 'src/api/MkBrowser';
import { makeGroupName } from 'src/helpers/groupName';

/**
 * Grouping and ungrouping of tabs
 */
export class Grouper implements MkGrouper {
    public constructor({ browser, store, Logger }: MkContstructorParams) {
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        if (!store) {
            throw new Error('No store');
        }
        this.store = store;

        if (!Logger) {
            throw new Error('No Logger');
        }
        this.logger = new Logger('tabs/Grouper');
        this.logger.log('constructor');
    }

    private readonly browser: MkGrouperBrowser;
    private readonly store: MkStore;
    private readonly logger: MkLogger;

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
        this.logger.log('addNewGroup', name, windowId);
        try {
            // We need to get the state before resetting groups using the
            // exact name. As a repercussion of this method, groups where the
            // count has changed are automatically reopened. This shouldn't
            // reopen groups that are collapsed as the user experience for a
            // collapsed group prevents the user from removing a tab.
            const title = `(${tabIds.length}) ${name}`;
            const prevGroup = await this.getGroupInfo({
                id: windowId,
                title,
            });
            const createProperties = { windowId };
            const options = { createProperties, tabIds };
            const groupId = await this.browser.tabs.group(options);
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
            this.logger.error('addNewGroup', error);
            throw error;
        }
    }

    /**
     * Remove tabs that are pinned from the list
     */
    private filterNonPinnedTabs(tabs: MkBrowser.tabs.Tab[]) {
        this.logger.log('filterNonPinnedTabs');
        const isTabPinned = (tab: MkBrowser.tabs.Tab) => !!tab.pinned;
        const nonPinnedTabs = tabs.filter((tab) => !isTabPinned(tab));
        return nonPinnedTabs;
    }

    /**
     * Get all the active tabs across all windows
     */
    private getActiveTabIdsByWindow(tabs: MkBrowser.tabs.Tab[]) {
        this.logger.log('getActiveTabIdsByWindow');
        const activeTabs = tabs.filter((tab) => tab.active);
        // Best to use domain specific typings here
        const activeTabIdsByWindow: MkActiveTabIdsByWindow = new Map<
            MkActiveTabIdsByWindowKey,
            MkActiveTabIdsByWindowValue
        >();
        activeTabs.forEach(({ id, windowId }) => {
            activeTabIdsByWindow.set(windowId, id);
        });
        this.logger.log('getActiveTabIdsByWindow', activeTabIdsByWindow);
        return activeTabIdsByWindow;
    }

    /**
     * Get the color based on each index so that each index will
     * retain the same color regardless of a group re-render
     */
    private getColorForGroup(index: number) {
        this.logger.log('getColorForGroup', index);
        const colorsByEnum = this.browser.tabGroups.Color;
        this.logger.log('getColorForGroup', colorsByEnum);
        const colorKeys = Object.keys(colorsByEnum);
        const colors = colorKeys.map((colorKey) =>
            colorKey.toLocaleLowerCase()
        );
        const colorIdx = index % colorKeys.length;
        const color = colors[colorIdx];
        this.logger.log('getColorForGroup', color);
        return color;
    }

    /**
     * Get the current properties for a group with
     * a given name for a specific window id
     */
    private async getGroupInfo({ id, title }: MkGetGroupInfoParams) {
        this.logger.log('getGroupInfo', title);
        try {
            // Be careful of the title as query titles are patterns where
            // chars can have special meaning (eg. * is a universal selector)
            const queryInfo = { title, windowId: id };
            const tabGroups = await this.browser.tabGroups.query(queryInfo);
            this.logger.log('getGroupInfo', tabGroups);
            return tabGroups[0];
        } catch (error) {
            this.logger.error('getGroupInfo', error);
            throw error;
        }
    }

    /**
     * Remove all existing groups
     */
    public async removeAllGroups(): Promise<void> {
        this.logger.log('removeAllGroups');
        try {
            const tabs = await this.browser.tabs.query({});
            const filterIds = (id: number | undefined): id is number =>
                typeof id !== 'undefined';
            const ids = tabs.map((tab) => tab.id).filter(filterIds);
            void this.removeGroupsForTabIds(ids);
        } catch (error) {
            this.logger.error('removeAllGroups', error);
            throw error;
        }
    }

    /**
     * Remove a list of tabs from any group
     * and the group itself when empty
     */
    private async removeGroupsForTabIds(ids: number[]) {
        this.logger.log('removeGroupsForTabIds', ids);
        try {
            await this.browser.tabs.ungroup(ids);
        } catch (error) {
            this.logger.error('removeGroupsForTabIds', error);
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
        this.logger.log('renderGroupsByName', tabIdsByGroup);
        // Offset the index to ignore orphan groups
        let groupIdxOffset = 0;
        const names = Object.keys(tabIdsByGroup);
        names.forEach((name, idx) => {
            this.logger.log('renderGroupsByName', name);
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
                    // Complexity isn't good here but it should be
                    // ok since collapse should be very rarely used
                    type === 'collapse' && typeof activeTabId !== 'undefined'
                        ? !tabIds.includes(activeTabId)
                        : false;
                this.logger.log('renderGroupsByName', forceCollapse);
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
    public async renderTabGroups({
        organizeType,
        tabs,
    }: MkRenderTabGroups): Promise<void> {
        this.logger.log('renderTabGroups');
        const nonPinnedTabs = this.filterNonPinnedTabs(tabs);
        const activeTabIdsByWindow = this.getActiveTabIdsByWindow(tabs);
        const tabIdsByGroup = await this.sortTabIdsByGroup(nonPinnedTabs);
        this.renderGroupsByName({
            activeTabIdsByWindow,
            type: organizeType,
            tabIdsByGroup,
        });
    }

    /**
     * Sort tabs by their group name and window id
     */
    private async sortTabIdsByGroup(tabs: MkBrowser.tabs.Tab[]) {
        this.logger.log('sortTabIdsByGroup');
        const tabIdsByGroup: MkTabIdsByGroup = {};
        const { forceWindowConsolidation } = await this.store.getState();
        const { enableSubdomainFiltering } = await this.store.getState();
        // Not using "chrome.windows.WINDOW_ID_CURRENT" as we rely on real
        // "windowId" in our algorithm which the representative -2 breaks
        const staticWindowId = tabs[0].windowId;
        tabs.forEach((tab) => {
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
            if (!tabIdsByGroup[groupName]) {
                tabIdsByGroup[groupName] = {
                    [chosenWindowId]: [id],
                };
            } else if (!tabIdsByGroup[groupName][chosenWindowId]) {
                tabIdsByGroup[groupName] = {
                    ...tabIdsByGroup[groupName],
                    [chosenWindowId]: [id],
                };
            } else {
                tabIdsByGroup[groupName][chosenWindowId].push(id);
            }
        });
        this.logger.log('sortTabIdsByGroup', tabIdsByGroup);
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
        this.logger.log('updateGroupProperties');
        try {
            const updateProperties = { collapsed, color, title };
            await this.browser.tabGroups.update(groupId, updateProperties);
        } catch (error) {
            this.logger.error('updateGroupProperties', error);
            throw error;
        }
    }
}
