import { describe, expect, mock, test } from 'bun:test';
import { setUninstallSurvey } from '../uninstall';

describe('setUninstallSurvey', () => {
    test('should set uninstall survey URL', () => {
        const runtimeSetUninstallUrlMock = mock(async () => {});
        setUninstallSurvey(runtimeSetUninstallUrlMock);
        const uninstallUrl = 'https://forms.gle/wNhryQtn8bHNLT488';
        const [result] = runtimeSetUninstallUrlMock.mock.calls;
        expect(result).toEqual([uninstallUrl]);
    });
});
