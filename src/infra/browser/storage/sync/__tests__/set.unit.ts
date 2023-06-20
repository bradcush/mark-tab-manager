import { storageSyncSet } from '../set';
import { SyncItems } from '../sync-types';

describe('storageSyncSet', () => {
    const originalChrome = global.chrome;
    const setMock = jest.fn();

    beforeEach(() => {
        global.chrome = {
            storage: {
                sync: {
                    set: setMock.mockImplementation(
                        (_items: SyncItems, callback: () => void) => {
                            callback();
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

    it('should resolve after items are stored', async () => {
        global.chrome.runtime.lastError = undefined;
        const items = {
            settings: 'settings',
        };
        const resolution = await storageSyncSet(items);
        expect(resolution).toBeUndefined();
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const items = {
            settings: 'settings',
        };
        await expect(storageSyncSet(items)).rejects.toBe('error');
    });
});
