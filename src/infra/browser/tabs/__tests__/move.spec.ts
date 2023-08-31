import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { tabsMove } from '../move';

describe('tabsMove', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            tabs: {
                move: mock(
                    (
                        _id: number,
                        _moveProperties: chrome.tabs.MoveProperties,
                        callback: () => void,
                    ) => {
                        callback();
                    },
                ),
            },
            runtime: {},
        } as unknown as typeof chrome;
    });

    afterEach(() => {
        global.chrome = originalChrome;
    });

    test('should resolve after moving a given tab', async () => {
        global.chrome.runtime.lastError = undefined;
        const tabId = 1;
        const moveProperties = { index: -1 };
        const resolution = await tabsMove(tabId, moveProperties);
        expect(resolution).toBeUndefined();
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const tabId = 1;
        const moveProperties = { index: -1 };
        expect(tabsMove(tabId, moveProperties)).rejects.toBe('error');
    });
});
