import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { storageSyncSet } from '../set';

describe('storageSyncSet', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            storage: {
                sync: {
                    set: mock(
                        (
                            _items: Record<string, unknown>,
                            callback: () => void
                        ) => {
                            callback();
                        }
                    ),
                },
            },
            runtime: {},
        } as unknown as typeof chrome;
    });

    afterEach(() => {
        global.chrome = originalChrome;
    });

    test('should resolve after items are stored', async () => {
        global.chrome.runtime.lastError = undefined;
        const items = {
            settings: 'settings',
        };
        const resolution = await storageSyncSet(items);
        expect(resolution).toBeUndefined();
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const items = {
            settings: 'settings',
        };
        expect(storageSyncSet(items)).rejects.toBe('error');
    });
});
