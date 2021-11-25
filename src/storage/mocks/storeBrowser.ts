import { MkSyncItems } from 'src/api/browser/storage/sync/MkSync';

const defaultItems = {
    clusterGroupedTabs: true,
    enableAutomaticGrouping: true,
    enableAlphabeticSorting: true,
    enableSubdomainFiltering: false,
    forceWindowConsolidation: false,
    showGroupTabCount: true,
};

export function makeSyncGet(
    items: MkSyncItems = defaultItems
): typeof chrome.storage.sync.get {
    return () => {
        const settings = JSON.stringify(items);
        return Promise.resolve({ settings });
    };
}
