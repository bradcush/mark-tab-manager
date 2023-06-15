import { setUninstallSurvey } from '../uninstall';
import { runtimeSetUninstallUrl } from 'src/infra/browser/runtime/set-uninstall-url';

// Mock wrapped browser API implementation
jest.mock('src/infra/browser/runtime/set-uninstall-url');

describe('setUninstallSurvey', () => {
    it('should set uninstall survey URL', () => {
        const uninstallUrl = 'https://forms.gle/wNhryQtn8bHNLT488';
        setUninstallSurvey();
        expect(runtimeSetUninstallUrl).toHaveBeenCalledWith(uninstallUrl);
    });
});
