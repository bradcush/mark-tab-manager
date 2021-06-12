import { MkSyncItems } from 'src/api/browser/storage/sync/MkSync';
import { MkBrowser } from 'src/api/MkBrowser';

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
): MkBrowser.storage.sync.Get {
    return () => {
        const settings = JSON.stringify(items);
        return Promise.resolve({ settings });
    };
}
