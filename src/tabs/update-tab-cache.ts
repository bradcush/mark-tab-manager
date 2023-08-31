import { logVerbose } from 'src/logs/console';
import { getPersistedStore } from 'src/storage/persisted-store-instance';
import { makeGroupName } from './domains/make-group-name';
import { getMemoryCache } from 'src/storage/memory-cache-instance';

/**
 * Make list cachable tab information
 */
async function makeCacheItems(tabs: chrome.tabs.Tab[]) {
    logVerbose('makeCacheItems');
    const { enableSubdomainFiltering } = await getPersistedStore().getState();
    const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
    return tabs.map(({ id, url }) => {
        const groupName = makeGroupName(groupType, url);
        return { key: id, value: groupName };
    });
}

/**
 * Cache a single updated tab
 * or rebuild everything
 */
export async function updateTabCache(
    tabs: chrome.tabs.Tab[],
    updatedTab?: chrome.tabs.Tab,
    clean = false,
): Promise<void> {
    if (clean) {
        // Clear the cache for rebuild
        getMemoryCache().flush();
    }
    const shouldCacheUpdatedOnly = getMemoryCache().exists() && updatedTab;
    const tabsToCache = shouldCacheUpdatedOnly ? [updatedTab] : tabs;
    const cacheItems = await makeCacheItems(tabsToCache);
    getMemoryCache().set(cacheItems);
}
