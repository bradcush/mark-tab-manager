import {
    MkSyncGetMockCallbackItems,
    MkSyncGetMockCallback,
} from './MkSyncMock';
import { MkBrowser } from 'src/api/MkBrowser';

export function makeSyncMock(items: MkSyncGetMockCallbackItems) {
    return ({
        get: (_key: string, callback: MkSyncGetMockCallback) => {
            callback(items);
        },
        set: jest.fn(),
    } as any) as MkBrowser.storage.Sync;
}
