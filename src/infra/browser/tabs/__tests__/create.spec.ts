import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { tabsCreate } from '../create';

describe('tabsCreate', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            tabs: {
                create: mock(
                    (
                        _createProerties: chrome.tabs.CreateProperties,
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

    test('should resolve after creating a new tab', async () => {
        global.chrome.runtime.lastError = undefined;
        const createProperties = { url: 'https://example.com' };
        const resolution = await tabsCreate(createProperties);
        expect(resolution).toMatchObject({ id: 1 });
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const createProperties = { url: 'https://example.com' };
        expect(tabsCreate(createProperties)).rejects.toBe('error');
    });
});
