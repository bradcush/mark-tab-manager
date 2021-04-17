import {
    MkContstructorParams,
    MkOrganizeParams,
    MkOrganizer,
    MkOrganizerBrowser,
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
import { MkSorter } from './MkSorter';
import { MkGrouper } from './MkGrouper';

/**
 * Organize open tabs
 */
export class Organizer implements MkOrganizer {
    public constructor({
        browser,
        cache,
        tabsGrouper,
        tabsSorter,
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

        if (!tabsGrouper) {
            throw new Error('No tabsGrouper');
        }
        this.tabsGrouper = tabsGrouper;

        if (!tabsSorter) {
            throw new Error('No tabsSorter');
        }
        this.tabsSorter = tabsSorter;

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
    private readonly tabsGrouper: MkGrouper;
    private readonly tabsSorter: MkSorter;
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
        this.browser.tabs.onUpdated.addListener(
            /* eslint-disable @typescript-eslint/no-misused-promises */
            async (tabId, changeInfo, tab) => {
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
                const {
                    enableSubdomainFiltering,
                } = await this.store.getState();
                const groupType = enableSubdomainFiltering
                    ? 'granular'
                    : 'shared';
                const groupName = makeGroupName({ type: groupType, url });
                const hasGroupChanged = this.cache.get(tabId) !== groupName;
                this.logger.log('browser.tabs.onUpdated', hasGroupChanged);
                if (!hasGroupChanged) {
                    return;
                }
                void this.organize({ tab });
            }
        );

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
     * Make list of cache information
     */
    private async makeCacheItems(tabs: MkBrowser.tabs.Tab[]) {
        const { enableSubdomainFiltering } = await this.store.getState();
        const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
        return tabs.map(({ id, url }) => {
            const groupName = makeGroupName({ type: groupType, url });
            return { key: id, value: groupName };
        });
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
            const cacheItems = await this.makeCacheItems(tabsToCache);
            this.cache.set(cacheItems);

            // Sorted tabs are needed for sorting or grouping
            const sortedTabs = await this.tabsSorter.sortTabs(tabs);
            const { enableAutomaticSorting } = await this.store.getState();
            if (enableAutomaticSorting) {
                void this.tabsSorter.renderSortedTabs(sortedTabs);
            }
            const isTabGroupingSupported = this.isTabGroupingSupported();
            const { enableAutomaticGrouping } = await this.store.getState();
            const isGroupingAllowed =
                isTabGroupingSupported && enableAutomaticGrouping;
            if (isGroupingAllowed) {
                void this.tabsGrouper.renderTabGroups({
                    organizeType: type,
                    tabs: sortedTabs,
                });
            }
        } catch (error) {
            this.logger.error('organize', error);
            throw error;
        }
    }
}
