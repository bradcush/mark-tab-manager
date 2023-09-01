import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { tabsGet } from '../get';

describe('tabsGet', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            tabs: {
                get: mock(
                    (_id: number, callback: (tab: chrome.tabs.Tab) => void) => {
                        const tab = {
                            id: 1,
                            windowId: 2,
                        } as chrome.tabs.Tab;
                        callback(tab);
                    },
                ),
            },
            runtime: {},
        } as unknown as typeof chrome;
    });

    afterEach(() => {
        global.chrome = originalChrome;
    });

    test('should resolve with tab for given tab id', async () => {
        global.chrome.runtime.lastError = undefined;
        const tabId = 1;
        const tab = await tabsGet(tabId);
        expect(tab).toMatchObject({
            id: 1,
            windowId: 2,
        });
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const tabId = 1;
        expect(tabsGet(tabId)).rejects.toBe('error');
    });
});
