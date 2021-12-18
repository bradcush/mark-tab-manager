import { get } from '../get';

describe('tabs/get', () => {
    const originalChrome = global.chrome;
    const getMock = jest.fn();

    beforeEach(() => {
        global.chrome = ({
            tabs: {
                get: getMock.mockImplementation(
                    (_id: number, callback: (tab: chrome.tabs.Tab) => void) => {
                        const tab = {
                            id: 1,
                            windowId: 2,
                        } as chrome.tabs.Tab;
                        callback(tab);
                    }
                ),
            },
            runtime: {},
        } as unknown) as typeof chrome;
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
        await expect(get(tabId)).rejects.toBe('error');
    });
});
