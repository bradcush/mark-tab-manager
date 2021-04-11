import {
    MkActiveTabIdsByWindow,
    MkActiveTabIdsByWindowKey,
    MkActiveTabIdsByWindowValue,
    MkAddNewGroupParams,
    MkContstructorParams,
    MkGetGroupInfoParams,
    MkOrganizeParams,
    MkOrganizer,
    MkOrganizerBrowser,
    MkRenderGroupsByNameParams,
    MkRenderTabGroups,
    MkTabIdsByGroup,
    MkUpdateGroupTitleParams,
} from './MkOrganizer';
import { MkBrowser } from 'src/api/MkBrowser';
import { makeGroupName } from 'src/helpers/groupName';
import { MkStore } from 'src/storage/MkStore';
import { isSupported as isTabGroupsUpdateSupported } from 'src/api/browser/tabGroups/update';
import { isSupported as isTabGroupsQuerySupported } from 'src/api/browser/tabGroups/query';
import { isSupported as isTabsGroupSupported } from 'src/api/browser/tabs/group';
import { isSupported as isTabsUngroupSupported } from 'src/api/browser/tabs/ungroup';
import { MkLogger } from 'src/logs/MkLogger';
import { MkCache } from 'src/storage/MkCache';

/**
 * Organize open tabs
 */
export class Organizer implements MkOrganizer {
    public constructor({
        browser,
        cache,
        store,
        Logger,
    }: MkContstructorParams) {
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        if (!cache) {
            throw new Error('No cache');
        }
        this.cache = cache;

        if (!store) {
            throw new Error('No store');
        }
        this.store = store;

        if (!Logger) {
            throw new Error('No Logger');
        }
        this.logger = new Logger('tabs/Organizer');
        this.logger.log('constructor');
    }

    private readonly browser: MkOrganizerBrowser;
    private readonly store: MkStore;
    private readonly cache: MkCache;
    private readonly logger: MkLogger;

    /**
     * Connect site organizer to triggering browser events
     */
    public connect(): void {
        this.logger.log('connect');

        // Organize tabs on install and update
        // TODO: Perfect candidate for business API creation
        this.browser.runtime.onInstalled.addListener((details) => {
            this.logger.log('browser.runtime.onInstalled', details);
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            // We have no shared dependencies
            if (details.reason === 'shared_module_update') {
                return;
            }
            void this.organize({ type: 'collapse' });
        });

        // Handle when the extension icon is clicked
        this.browser.action.onClicked.addListener(() => {
            this.logger.log('browser.action.onClicked');
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            void this.organize();
        });

        /**
         * Handle tabs where a URL is updated
         */
        this.browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            this.logger.log('browser.tabs.onUpdated', changeInfo);
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            const { status, url } = changeInfo;
            // Prevent triggering of updates when we aren't loading
            // so we can treat tabs as early as possible
            if (status !== 'loading') {
                return;
            }
            // If there is no url change we don't consider updating its group.
            // (It's observed that only loading tabs can have a url and that
            // reloading a tab doesn't send a url)
            if (!url) {
                return;
            }
            // If the group categorization didn't change
            // then we don't bother to organize
            const groupName = makeGroupName({ type: 'shared', url });
            const hasGroupChanged = this.cache.get(tabId) !== groupName;
            this.logger.log('browser.tabs.onUpdated', hasGroupChanged);
            if (!hasGroupChanged) {
                return;
            }
            void this.organize({ tab });
        });

        // Handle removed tabs
        this.browser.tabs.onRemoved.addListener((tabId) => {
            this.logger.log('browser.tabs.onRemoved', tabId);
            // Remove the current tab id from group tracking regardless
            // of if we are automatically sorting to stay updated
            this.cache.remove(tabId);
            void this.organize();
        });
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
     * Compare to be used with sorting where "newtab"
     * is last and specifically references the group
     */
    private compareGroups(a: string, b: string) {
        if (a === b) {
            return 0;
        }
        if (a === 'new') {
            return 1;
        }
        if (b === 'new') {
            return -1;
        }
        return a.localeCompare(b);
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
     * Check if all used tab grouping APIs are supported
     */
    public isTabGroupingSupported(): boolean {
        return (
            isTabGroupsUpdateSupported() &&
            isTabGroupsQuerySupported() &&
            isTabsGroupSupported() &&
            isTabsUngroupSupported()
        );
    }

    /**
     * Order and group all tabs
     */
    public async organize(
        { tab, type = 'default' }: MkOrganizeParams = { type: 'default' }
    ): Promise<void> {
        this.logger.log('organize');
        try {
            const tabs = await this.browser.tabs.query({});
            // Cache tabs regardless settings as early as possible
            const isCacheFilled = this.cache.exists();
            // Cache a single addition tab or everything
            const tabsToCache = isCacheFilled && tab ? [tab] : tabs;
            const cacheItems = tabsToCache.map(({ id, url }) => ({
                key: id,
                value: makeGroupName({ type: 'shared', url }),
            }));
            this.cache.set(cacheItems);

            // Sorted tabs are needed for sorting or grouping
            const sortedTabs = await this.sortTabsAlphabetically(tabs);
            const { enableAutomaticSorting } = await this.store.getState();
            if (enableAutomaticSorting) {
                void this.renderSortedTabs(sortedTabs);
            }
            const isTabGroupingSupported = this.isTabGroupingSupported();
            const { enableAutomaticGrouping } = await this.store.getState();
            const isGroupingAllowed =
                isTabGroupingSupported && enableAutomaticGrouping;
            if (isGroupingAllowed) {
                void this.renderTabGroups({
                    organizeType: type,
                    tabs: sortedTabs,
                });
            }
        } catch (error) {
            this.logger.error('organize', error);
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
     * Reorder browser tabs in the current
     * window according to tabs list
     */
    private async renderSortedTabs(tabs: MkBrowser.tabs.Tab[]) {
        this.logger.log('renderSortedTabs', tabs);
        try {
            // Not using "chrome.windows.WINDOW_ID_CURRENT" as we rely on real
            // "windowId" in our algorithm which the representative -2 breaks
            const staticWindowId = tabs[0].windowId;
            const { forceWindowConsolidation } = await this.store.getState();
            /* eslint-disable @typescript-eslint/no-misused-promises */
            tabs.forEach(async (tab) => {
                const { id } = tab;
                if (!id) {
                    throw new Error('No id for sorted tab');
                }
                const baseMoveProperties = { index: -1 };
                // Specify the current window as the forced window
                const staticWindowMoveProperties = {
                    windowId: staticWindowId,
                };
                // Current default uses the window for the current tab
                const moveProperties = forceWindowConsolidation
                    ? { ...baseMoveProperties, ...staticWindowMoveProperties }
                    : baseMoveProperties;
                // We expect calls to move to still run in parallel
                // but await simply to catch errors properly
                await this.browser.tabs.move(id, moveProperties);
            });
        } catch (error) {
            this.logger.error('renderSortedTabs', error);
            throw error;
        }
    }

    /**
     * Group tabs in the browser
     */
    private async renderTabGroups({ organizeType, tabs }: MkRenderTabGroups) {
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
     * Sort tabs alphabetically using their hostname with
     * exceptions for system tabs and most specifically "newtab"
     */
    private async sortTabsAlphabetically(tabs: MkBrowser.tabs.Tab[]) {
        this.logger.log('sortTabsAlphabetically', tabs);
        const { enableSubdomainFiltering } = await this.store.getState();
        const sortedTabs = tabs.sort((a, b) => {
            const urlOne = a.url;
            const urlTwo = b.url;
            if (!urlOne || !urlTwo) {
                throw new Error('No url for sorted tab');
            }
            const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
            const groupOne = makeGroupName({ type: groupType, url: urlOne });
            const groupTwo = makeGroupName({ type: groupType, url: urlTwo });
            return this.compareGroups(groupOne, groupTwo);
        });
        return sortedTabs;
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
