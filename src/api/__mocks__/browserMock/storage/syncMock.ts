import {
    MkSyncGetMockCallbackItems,
    MkSyncGetMockCallback,
} from './MkSyncMock';

export function makeSyncMock(items: MkSyncGetMockCallbackItems) {
    return {
        get: (_key: string, callback: MkSyncGetMockCallback) => {
            callback(items);
        },
        set: jest.fn(),
    };
}
