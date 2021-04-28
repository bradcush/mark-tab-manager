import { get } from '../get';
import { getMock } from '../mocks/get';

describe('get', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            storage: {
                sync: {
                    get: getMock,
                },
            },
            runtime: {},
        } as typeof chrome;
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
        await expect(get(key)).rejects.toMatchObject({
            message: 'error',
        });
    });
});
