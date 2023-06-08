import { setUninstallUrl } from '../uninstall';
import { setUninstallURL as runtimeSetUninstallURL } from 'src/api/browser/runtime/setUninstallURL';

// Mock wrapped browser API implementation
jest.mock('src/api/browser/runtime/setUninstallURL');

describe('setUninstallUrl', () => {
    it('should set uninstall survey URL', () => {
        const uninstallUrl = 'https://forms.gle/wNhryQtn8bHNLT488';
        setUninstallUrl();
        expect(runtimeSetUninstallURL).toHaveBeenCalledWith(uninstallUrl);
    });
});
