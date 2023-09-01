import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { tabsQuery } from '../query';

describe('tabsQuery', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            tabs: {
                query: mock(
                    (
                        _queryInfo: chrome.tabs.QueryInfo,
                        callback: (tabs: chrome.tabs.Tab[]) => void,
                    ) => {
                        const tab = {
                            id: 1,
                            windowId: 2,
                        } as chrome.tabs.Tab;
                        callback([tab]);
                    },
                ),
            },
            runtime: {},
        } as unknown as typeof chrome;
    });

    afterEach(() => {
        global.chrome = originalChrome;
    });

    test('should resolve with tabs for query match', async () => {
        global.chrome.runtime.lastError = undefined;
        const queryInfo = { title: 'title' };
        const tabs = await tabsQuery(queryInfo);
        expect(tabs[0]).toMatchObject({
            id: 1,
            windowId: 2,
        });
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const queryInfo = { title: 'title' };
        expect(tabsQuery(queryInfo)).rejects.toBe('error');
    });
});
