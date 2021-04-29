import { MkSyncItems } from 'src/api/browser/storage/sync/MkSync';
import { MkBrowser } from 'src/api/MkBrowser';
import { MkStoreBrowser } from '../MkStore';

const defaultItems = {
    clusterGroupedTabs: true,
    enableAutomaticGrouping: true,
    enableAlphabeticSorting: true,
    enableSubdomainFiltering: false,
    forceWindowConsolidation: false,
};

export function makeSyncGet(
    items: MkSyncItems = defaultItems
): MkBrowser.storage.sync.Get {
    return () => {
        const settings = JSON.stringify(items);
        return Promise.resolve({ settings });
    };
}

export function makeStoreBrowser(
    syncGetMock: MkBrowser.storage.sync.Get = makeSyncGet()
): MkStoreBrowser {
    return ({
        storage: {
            sync: {
                get: syncGetMock,
                set: jest.fn(),
            },
        },
        // Mocking requires any assertion
        // eslint-disable-next-line
    } as any) as MkStoreBrowser;
}
