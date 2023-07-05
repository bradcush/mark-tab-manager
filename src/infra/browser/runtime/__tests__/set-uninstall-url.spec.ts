import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { runtimeSetUninstallUrl } from '../set-uninstall-url';

describe('runtimeSetUninstallUrl', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            runtime: {
                setUninstallURL: mock((_url: string, callback: () => void) => {
                    callback();
                }),
            },
        } as unknown as typeof chrome;
    });

    afterEach(() => {
        global.chrome = originalChrome;
    });

    test('should resolve after uninstall URL is set', async () => {
        global.chrome.runtime.lastError = undefined;
        const uninstallUrl = 'https://uninstall.survey';
        const resolution = await runtimeSetUninstallUrl(uninstallUrl);
        expect(resolution).toBeUndefined();
    });

    test('should reject with error if one exists', () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const uninstallUrl = 'https://uninstall.survey';
        expect(runtimeSetUninstallUrl(uninstallUrl)).rejects.toBe('error');
    });
});
