import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { contextMenusCreate } from '../create';

describe('contextMenusCreate', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            contextMenus: {
                create: mock(
                    (
                        _createProperties: chrome.contextMenus.CreateProperties,
                        callback: () => void
                    ) => {
                        callback();
                    }
                ),
            },
            runtime: {},
        } as unknown as typeof chrome;
    });

    afterEach(() => {
        global.chrome = originalChrome;
    });

    test('should resolve after menu item is created', async () => {
        global.chrome.runtime.lastError = undefined;
        const createProperties = {
            id: 'menuItem',
            title: 'menuItem',
        };
        const resolution = await contextMenusCreate(createProperties);
        expect(resolution).toBeUndefined();
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const createProperties = {
            id: 'menuItem',
            title: 'menuItem',
        };
        expect(contextMenusCreate(createProperties)).rejects.toBe('error');
    });
});
