import { setUninstallUrl } from '../uninstall';

describe('setUninstallUrl', () => {
    it('should set uninstall survey URL', () => {
        const uninstallUrl = 'https://forms.gle/wNhryQtn8bHNLT488';
        const runtime = { setUninstallURL: jest.fn() };
        const uninstallBrowser = { runtime };
        setUninstallUrl(uninstallBrowser);
        expect(runtime.setUninstallURL).toBeCalledWith(uninstallUrl);
    });
});
