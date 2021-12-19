import { get } from '../get';
import { MkSyncGetKeys, MkSyncItems } from '../MkSync';

describe('storage/get', () => {
    const originalChrome = global.chrome;
    const getMock = jest.fn();

    beforeEach(() => {
        global.chrome = ({
            storage: {
                sync: {
                    get: getMock.mockImplementation(
                        (
                            _keys: MkSyncGetKeys,
                            callback: (items: MkSyncItems) => void
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
        } as unknown) as typeof chrome;
    });
    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should resolve with items for given key', async () => {
        global.chrome.runtime.lastError = undefined;
        const key = 'settings';
        const items = await get(key);
        expect(items).toMatchObject({
            settings: 'settings',
        });
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const key = 'settings';
        await expect(get(key)).rejects.toBe('error');
    });
});
