import { storageSyncGet } from '../get';
import { SyncGetKeys, SyncItems } from '../sync-types';

describe('storageSyncGet', () => {
    const originalChrome = global.chrome;
    const getMock = jest.fn();

    beforeEach(() => {
        global.chrome = {
            storage: {
                sync: {
                    get: getMock.mockImplementation(
                        (
                            _keys: SyncGetKeys,
                            callback: (items: SyncItems) => void
                        ) => {
                            const items = {
                                settings: 'settings',
                            };
                            callback(items);
                        }
                    ),
                },
            },
            runtime: {},
        } as unknown as typeof chrome;
    });

    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should resolve with items for given key', async () => {
        global.chrome.runtime.lastError = undefined;
        const key = 'settings';
        const items = await storageSyncGet(key);
        expect(items).toMatchObject({
            settings: 'settings',
        });
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const key = 'settings';
        await expect(storageSyncGet(key)).rejects.toBe('error');
    });
});
