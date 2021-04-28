import { get } from '../get';
import { getMock } from '../mocks/get';

describe('get', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            tabs: {
                get: getMock,
            },
            runtime: {},
        } as typeof chrome;
    });
    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should resolve with tab for given tab id', async () => {
        global.chrome.runtime.lastError = undefined;
        const tabId = 1;
        const tab = await get(tabId);
        expect(tab).toMatchObject({
            id: 1,
            windowId: 2,
        });
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const tabId = 1;
        await expect(get(tabId)).rejects.toMatchObject({
            message: 'error',
        });
    });
});
