import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { tabsUngroup } from '../ungroup';

describe('tabsUngroup', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        // Mocking requires any assertion for setting tabGroups
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global.chrome as any) = {
            tabs: {
                ungroup: mock((_tabIds: number[], callback: () => void) => {
                    callback();
                }),
            },
            runtime: {},
        };
    });

    afterEach(() => {
        global.chrome = originalChrome;
    });

    test('should throw when ungroup is lacking support', () => {
        // Setting tabGroups requires any
        // eslint-disable-next-line
        (global.chrome as any).tabs.ungroup = undefined;
        global.chrome.runtime.lastError = undefined;
        const tabIds = [1];
        expect(() => {
            void tabsUngroup(tabIds);
        }).toThrow('No tabs.ungroup support');
    });

    test('should resolve after tab ids are ungrouped', async () => {
        global.chrome.runtime.lastError = undefined;
        const tabIds = [1];
        const resolution = await tabsUngroup(tabIds);
        expect(resolution).toBeUndefined();
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const tabIds = [1];
        expect(tabsUngroup(tabIds)).rejects.toBe('error');
    });
});
