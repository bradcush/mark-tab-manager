import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { storageSyncGet } from '../get';

describe('storageSyncGet', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            storage: {
                sync: {
                    get: mock(
                        (
                            _keys: string | Record<string, unknown>,
                            callback: (items: Record<string, unknown>) => void
                        ) => {
                            const items = {
                                settings: 'settings',
                            };
                            callback(items);
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

    test('should resolve with items for given key', async () => {
        global.chrome.runtime.lastError = undefined;
        const key = 'settings';
        const items = await storageSyncGet(key);
        expect(items).toMatchObject({
            settings: 'settings',
        });
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const key = 'settings';
        expect(storageSyncGet(key)).rejects.toBe('error');
    });
});
