import { isTabGroupingSupported } from 'src/infra/browser/tab-groups/is-supported';
import { tabsRender } from 'src/infra/business/tabs/render';
import { logVerbose } from 'src/logs/console';
import { getPersistedStore } from 'src/storage/persisted-store-instance';
import { OrganizeTabParams } from './tabs-types';
import { tabsQuery } from 'src/infra/browser/tabs/query';
import { updateTabCache } from './update-tab-cache';
import { treatTabOrder } from './treat-tab-order';
import { groupTabs } from './group-tabs';

/**
 * Remove tabs that are pinned from the list
 */
function filterPinnedTabs(tabs: chrome.tabs.Tab[]) {
    logVerbose('filterPinnedTabs');
    const isTabPinned = (tab: chrome.tabs.Tab) => !!tab.pinned;
    return tabs.filter((tab) => !isTabPinned(tab));
}

/**
 * Reorder browser tabs in the current
 * window according to tabs list
 */
async function reorderTabs(tabs: chrome.tabs.Tab[]) {
    logVerbose('reorderTabs', tabs);
    // Not using "chrome.windows.WINDOW_ID_CURRENT" as we rely on real
    // "windowId" in our algorithm which the representative -2 breaks
    const staticWindowId = tabs[0].windowId;
    const { forceWindowConsolidation } = await getPersistedStore().getState();
    const tabsToUpdate = tabs.map(({ id }) => {
        // Specify the current window as forced window
        const calculatedWindowId = forceWindowConsolidation
            ? staticWindowId
            : undefined;
        return {
            identifier: id,
            windowId: calculatedWindowId,
        };
    });
    tabsRender(tabsToUpdate);
}

/**
 * Should we group items based on support
 * and whether the feature is activated
 */
async function isGroupingEnabled() {
    const { enableAutomaticGrouping } = await getPersistedStore().getState();
    return isTabGroupingSupported() && enableAutomaticGrouping;
}

/**
 * Order and group all tabs based on settings with
 * the ability to clean and rebuild the cache
 */
export async function organizeTabs({
    clean = false,
    format = 'default',
    updatedTab,
}: OrganizeTabParams): Promise<void> {
    logVerbose('organizeTabs', format);
    const tabs = await tabsQuery({});
    const unpinnedTabs = filterPinnedTabs(tabs);
    // Cache tabs early regardless of settings
    await updateTabCache(unpinnedTabs, updatedTab, clean);
    const treatedTabs = await treatTabOrder(unpinnedTabs);
    const { clusterGroupedTabs, enableAlphabeticSorting } =
        await getPersistedStore().getState();
    // Clustering regardless of grouping support
    if (enableAlphabeticSorting || clusterGroupedTabs) {
        void reorderTabs(treatedTabs);
    }
    if (await isGroupingEnabled()) {
        void groupTabs(format, treatedTabs, updatedTab);
    }
}
