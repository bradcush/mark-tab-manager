import { setUninstallURL } from '../setUninstallURL';
import { setUninstallURLMock } from '../mocks/setUninstallURL';

describe('runtime/setUninstallURL', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            runtime: {
                setUninstallURL: setUninstallURLMock,
            },
        } as typeof chrome;
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
        await expect(setUninstallURL(uninstallUrl)).rejects.toMatchObject({
            message: 'error',
        });
    });
});
