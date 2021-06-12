import {
    MkContstructorParams,
    MkIsGroupChanged,
    MkOrganizeParams,
    MkOrganizer,
} from './MkOrganizer';
import { MkBrowser } from 'src/api/MkBrowser';
import { makeGroupName } from 'src/helpers/groupName';
import { MkStore } from 'src/storage/MkStore';
import { MkCache } from 'src/storage/MkCache';
import { MkSorter } from './MkSorter';
import { MkGrouper } from './MkGrouper';
import { browser } from 'src/api/browser';
import { logError, logVerbose } from 'src/logs/console';

/**
 * Organize open tabs
 */
export class Organizer implements MkOrganizer {
    public constructor({
        cache,
        store,
        tabsGrouper,
        tabsSorter,
    }: MkContstructorParams) {
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

        logVerbose('constructor');
    }

    private readonly cache: MkCache;
    private readonly store: MkStore;
    private readonly tabsGrouper: MkGrouper;
    private readonly tabsSorter: MkSorter;

    /**
     * Connect site organizer to triggering browser events
     */
    public connect(): void {
        logVerbose('connect');

        // Organize tabs on install and update
        // TODO: Perfect candidate for business API creation
        browser.runtime.onInstalled.addListener((details) => {
            logVerbose('browser.runtime.onInstalled', details);
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            // We have no shared dependencies
            if (details.reason === 'shared_module_update') {
                return;
            }
            void this.organize({ type: 'collapse' });
        });

        // Organize tabs when enabled but previously installed
        browser.management.onEnabled.addListener((info) => {
            logVerbose('browser.management.onEnabled', info);
            // We only care about ourselves being enabled
            const isEnabled = info.id === browser.runtime.id;
            if (!isEnabled) {
                return;
            }
            void this.organize({ type: 'collapse' });
        });

        // Handle when the extension icon is clicked
        browser.action.onClicked.addListener(() => {
            logVerbose('browser.action.onClicked');
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            void this.organize({ type: 'collapse' });
        });

        // Handle tabs where a URL is updated
        browser.tabs.onUpdated.addListener(
            // Handlers can be async since we just care to fire and forget
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (tabId, changeInfo, tab) => {
                logVerbose('browser.tabs.onUpdated', changeInfo);
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
        browser.tabs.onRemoved.addListener((tabId) => {
            logVerbose('browser.tabs.onRemoved', tabId);
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
        logVerbose('isGroupChanged');
        const { enableSubdomainFiltering } = await this.store.getState();
        const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
        const groupName = makeGroupName({ type: groupType, url: currentUrl });
        const isGroupChanged = this.cache.get(id) !== groupName;
        logVerbose('isTabUpdated', isGroupChanged);
        return isGroupChanged;
    }

    /**
     * Make list of cache information
     */
    private async makeCacheItems(tabs: MkBrowser.tabs.Tab[]) {
        logVerbose('makeCacheItems');
        const { enableSubdomainFiltering } = await this.store.getState();
        const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
        return tabs.map(({ id, url }) => {
            const groupName = makeGroupName({ type: groupType, url });
            return { key: id, value: groupName };
        });
    }

    /**
     * Order and group all tabs with the ability
     * to clean and rebuild the cache
     */
    public async organize(
        { clean = false, tab, type = 'default' }: MkOrganizeParams = {
            clean: false,
            type: 'default',
        }
    ): Promise<void> {
        logVerbose('organize');
        try {
            const unsortedTabs = await browser.tabs.query({});
            // Filter to organize only the tabs want to
            const filteredTabs = this.tabsSorter.filter(unsortedTabs);
            // Clear the cache when forced so
            // we can rebuild when desired
            if (clean) {
                this.cache.flush();
            }
            // Cache tabs regardless of settings as early as possible
            // and cache a single updated tab or rebuild everything
            const tabsToCache =
                this.cache.exists() && tab ? [tab] : filteredTabs;
            const cacheItems = await this.makeCacheItems(tabsToCache);
            this.cache.set(cacheItems);
            const {
                clusterGroupedTabs,
                enableAlphabeticSorting,
            } = await this.store.getState();
            const unsortedGroups = await this.tabsGrouper.group(filteredTabs);
            const sortedTabs = await this.tabsSorter.sort({
                groups: unsortedGroups,
                tabs: filteredTabs,
            });
            // We currently allow clustering even
            // when grouping is disabled
            if (enableAlphabeticSorting || clusterGroupedTabs) {
                void this.tabsSorter.render(sortedTabs);
            }
            const isGroupingEnabled = await this.tabsGrouper.isEnabled();
            if (isGroupingEnabled) {
                // Important to recalculate groups so the object insertion
                // order matches expected visual group order. We may depend on
                // this order when iterating later to create groups and update
                // properties like their color predictably.
                const sortedGroups = await this.tabsGrouper.group(sortedTabs);
                this.tabsGrouper.render({
                    groups: sortedGroups,
                    organizeType: type,
                    tabs: sortedTabs,
                });
            }
        } catch (error) {
            logError('organize', error);
            throw error;
        }
    }
}
