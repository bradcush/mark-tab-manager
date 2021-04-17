import {
    MkContstructorParams,
    MkIsGroupChanged,
    MkOrganizeParams,
    MkOrganizer,
    MkOrganizerBrowser,
} from './MkOrganizer';
import { MkBrowser } from 'src/api/MkBrowser';
import { makeGroupName } from 'src/helpers/groupName';
import { MkStore } from 'src/storage/MkStore';
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
        store,
        tabsGrouper,
        tabsSorter,
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

        if (!tabsGrouper) {
            throw new Error('No tabsGrouper');
        }
        this.tabsGrouper = tabsGrouper;

        if (!tabsSorter) {
            throw new Error('No tabsSorter');
        }
        this.tabsSorter = tabsSorter;

        if (!Logger) {
            throw new Error('No Logger');
        }
        this.logger = new Logger('tabs/Organizer');
        this.logger.log('constructor');
    }

    private readonly browser: MkOrganizerBrowser;
    private readonly cache: MkCache;
    private readonly logger: MkLogger;
    private readonly store: MkStore;
    private readonly tabsGrouper: MkGrouper;
    private readonly tabsSorter: MkSorter;

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

        // Handle tabs where a URL is updated
        this.browser.tabs.onUpdated.addListener(
            // Handlers can be async since we just care to fire and forget
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
                // If there is no url change we don't consider updating its
                // group. (It's observed that only loading tabs can have a url
                // and that reloading a tab doesn't send a url)
                if (!url) {
                    return;
                }
                // If the group assignation didn't change
                // then we don't bother to organize
                const isGroupChanged = await this.isGroupChanged({
                    id: tabId,
                    currentUrl: url,
                });
                if (!isGroupChanged) {
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
     * Has the group assignation for a tab changed based
     * on it's url relative to what's in the cache
     */
    private async isGroupChanged({ currentUrl, id }: MkIsGroupChanged) {
        this.logger.log('isGroupChanged');
        const { enableSubdomainFiltering } = await this.store.getState();
        const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
        const groupName = makeGroupName({ type: groupType, url: currentUrl });
        const isGroupChanged = this.cache.get(id) !== groupName;
        this.logger.log('isTabUpdated', isGroupChanged);
        return isGroupChanged;
    }

    /**
     * Make list of cache information
     */
    private async makeCacheItems(tabs: MkBrowser.tabs.Tab[]) {
        this.logger.log('makeCacheItems');
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
            // Cache tabs regardless of settings as early as possible
            // and cache a single updated tab or everything
            const tabsToCache = this.cache.exists() && tab ? [tab] : tabs;
            const cacheItems = await this.makeCacheItems(tabsToCache);
            this.cache.set(cacheItems);
            // Sorted tabs are needed for sorting and grouping
            const sortedTabs = await this.tabsSorter.sort(tabs);
            const { enableAutomaticSorting } = await this.store.getState();
            if (enableAutomaticSorting) {
                void this.tabsSorter.render(sortedTabs);
            }
            const isGroupingEnabled = await this.tabsGrouper.isEnabled();
            if (isGroupingEnabled) {
                void this.tabsGrouper.render({
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
