import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { actionSetBadgeBackgroundColor } from '../set-badge-background-color';

describe('actionSetBadgeBackgroundColor', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            action: {
                setBadgeBackgroundColor: mock(
                    (
                        _details: chrome.action.BadgeBackgroundColorDetails,
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
        const details = { color: '#000' };
        const resolution = await actionSetBadgeBackgroundColor(details);
        expect(resolution).toBeUndefined();
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const details = { color: '#000' };
        expect(actionSetBadgeBackgroundColor(details)).rejects.toBe('error');
    });
});
