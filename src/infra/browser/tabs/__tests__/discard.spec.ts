import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { tabsDiscard } from '../discard';

describe('tabsDiscard', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            tabs: {
                discard: mock(
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
        } as unknown as typeof chrome;
    });

    afterEach(() => {
        global.chrome = originalChrome;
    });

    test('should resolve with tab discarded if successful', async () => {
        global.chrome.runtime.lastError = undefined;
        const tabId = 1;
        const tab = await tabsDiscard(tabId);
        expect(tab).toMatchObject({ id: 1 });
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const tabId = 1;
        expect(tabsDiscard(tabId)).rejects.toBe('error');
    });
});
