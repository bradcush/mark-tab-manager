import { discard } from '../discard';

describe('tabs/discard', () => {
    const originalChrome = global.chrome;
    const discardMock = jest.fn();

    beforeEach(() => {
        global.chrome = ({
            tabs: {
                discard: discardMock.mockImplementation(
                    (
                        _tabId: number,
                        callback: (tab: chrome.tabs.Tab) => void
                    ) => {
                        const tab = {
                            id: 1,
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

    it('should resolve with tab discarded if successful', async () => {
        global.chrome.runtime.lastError = undefined;
        const tabId = 1;
        const tab = await discard(tabId);
        expect(tab).toMatchObject({ id: 1 });
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const tabId = 1;
        await expect(discard(tabId)).rejects.toBe('error');
    });
});
