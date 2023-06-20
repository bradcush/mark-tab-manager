import { tabsQuery } from '../query';

describe('tabsQuery', () => {
    const originalChrome = global.chrome;
    const queryMock = jest.fn();

    beforeEach(() => {
        global.chrome = {
            tabs: {
                query: queryMock.mockImplementation(
                    (
                        _queryInfo: chrome.tabs.QueryInfo,
                        callback: (tabs: chrome.tabs.Tab[]) => void
                    ) => {
                        const tab = {
                            id: 1,
                            windowId: 2,
                        } as chrome.tabs.Tab;
                        callback([tab]);
                    }
                ),
            },
            runtime: {},
        } as unknown as typeof chrome;
    });

    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should resolve with tabs for query match', async () => {
        global.chrome.runtime.lastError = undefined;
        const queryInfo = { title: 'title' };
        const tabs = await tabsQuery(queryInfo);
        expect(tabs[0]).toMatchObject({
            id: 1,
            windowId: 2,
        });
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const queryInfo = { title: 'title' };
        await expect(tabsQuery(queryInfo)).rejects.toBe('error');
    });
});
