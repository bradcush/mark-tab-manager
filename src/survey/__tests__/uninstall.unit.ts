import { setUninstallUrl } from '../uninstall';
import { browser } from 'src/api/browser';

// Mock wrapped browser API implementation
jest.mock('src/api/browser', () => ({
    browser: {
        runtime: {
            setUninstallURL: jest.fn(),
        },
    },
}));

describe('setUninstallUrl', () => {
    it('should set uninstall survey URL', () => {
        const uninstallUrl = 'https://forms.gle/wNhryQtn8bHNLT488';
        setUninstallUrl();
        const { setUninstallURL } = browser.runtime;
        expect(setUninstallURL).toBeCalledWith(uninstallUrl);
    });
});
