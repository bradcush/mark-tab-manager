import { MkIsGroupChanged, MkOrganizeParams } from './MkOrganize';
import { MkBrowser } from 'src/api/MkBrowser';
import { makeGroupName } from 'src/helpers/groupName';
import { browser } from 'src/api/browser';
import { logError, logVerbose } from 'src/logs/console';
import { getStore } from 'src/storage/Store';
import {
    filter as filterTabs,
    render as renderTabs,
    sort as sortTabs,
} from './sort';
import {
    group as groupTabs,
    isEnabled as isGroupingEnabled,
    render as renderGroups,
} from './group';
import { getMemoryCache } from 'src/storage/MemoryCache';

/**
 * Has the group assignation for a tab changed based
 * on it's url relative to what's in the cache
 */
export async function isGroupChanged({
    currentUrl,
    id,
}: MkIsGroupChanged): Promise<boolean> {
    logVerbose('isGroupChanged');
    const { enableSubdomainFiltering } = await getStore().getState();
    const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
    const groupName = makeGroupName({ type: groupType, url: currentUrl });
    const isGroupChanged = getMemoryCache().get(id) !== groupName;
    return isGroupChanged;
}

/**
 * Make list of cache information
 */
async function makeCacheItems(tabs: MkBrowser.tabs.Tab[]) {
    logVerbose('makeCacheItems');
    const { enableSubdomainFiltering } = await getStore().getState();
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
export async function organize(
    { clean = false, tab, type = 'default' }: MkOrganizeParams = {
        clean: false,
        type: 'default',
    }
): Promise<void> {
    try {
        logVerbose('organize');
        const unsortedTabs = await browser.tabs.query({});
        // Filter to organize only the tabs want to
        const filteredTabs = filterTabs(unsortedTabs);
        // Clear the cache when forced so
        // we can rebuild when desired
        if (clean) {
            getMemoryCache().flush();
        }
        // Cache tabs regardless of settings as early as possible
        // and cache a single updated tab or rebuild everything
        const tabsToCache =
            getMemoryCache().exists() && tab ? [tab] : filteredTabs;
        const cacheItems = await makeCacheItems(tabsToCache);
        getMemoryCache().set(cacheItems);
        const {
            clusterGroupedTabs,
            enableAlphabeticSorting,
        } = await getStore().getState();
        const unsortedGroups = await groupTabs(filteredTabs);
        const sortedTabs = await sortTabs({
            groups: unsortedGroups,
            tabs: filteredTabs,
        });
        // We currently allow clustering even
        // when grouping is disabled
        if (enableAlphabeticSorting || clusterGroupedTabs) {
            void renderTabs(sortedTabs);
        }
        if (await isGroupingEnabled()) {
            // Important to recalculate groups so the object insertion
            // order matches expected visual group order. We may depend on
            // this order when iterating later to create groups and update
            // properties like their color predictably.
            const sortedGroups = await groupTabs(sortedTabs);
            renderGroups({
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
