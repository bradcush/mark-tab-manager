import { setUninstallURL } from '../setUninstallURL';

describe('runtime/setUninstallURL', () => {
    const originalChrome = global.chrome;
    const setUninstallURLMock = jest.fn();

    beforeEach(() => {
        global.chrome = {
            runtime: {
                setUninstallURL: setUninstallURLMock.mockImplementation(
                    (_url: string, callback: () => void) => {
                        callback();
                    }
                ),
            },
        } as unknown as typeof chrome;
    });
    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should resolve after uninstall URL is set', async () => {
        global.chrome.runtime.lastError = undefined;
        const uninstallUrl = 'https://uninstall.survey';
        const resolution = await setUninstallURL(uninstallUrl);
        expect(resolution).toBeUndefined();
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const uninstallUrl = 'https://uninstall.survey';
        await expect(setUninstallURL(uninstallUrl)).rejects.toBe('error');
    });
});
