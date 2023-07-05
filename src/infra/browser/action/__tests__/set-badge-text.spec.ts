import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { actionSetBadgeText } from '../set-badge-text';

describe('actionSetBadgeText', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            action: {
                setBadgeText: mock(
                    (
                        _details: chrome.action.BadgeTextDetails,
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

    test('should resolve after color is correctly set', async () => {
        global.chrome.runtime.lastError = undefined;
        const details = { text: 'text' };
        const resolution = await actionSetBadgeText(details);
        expect(resolution).toBeUndefined();
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const details = { text: 'text' };
        expect(actionSetBadgeText(details)).rejects.toBe('error');
    });
});
