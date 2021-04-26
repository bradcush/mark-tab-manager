import { setBadgeText } from '../setBadgeText';
import { setBadgeTextMock } from './mocks/setBadgeText';

describe('setBadgeText', () => {
    const originalSetBadgeText = global.chrome?.action?.setBadgeText;
    const originalRuntimeError = global.chrome?.runtime?.lastError;

    beforeAll(() => {
        global.chrome = {
            action: {
                setBadgeText: setBadgeTextMock,
            },
            runtime: {},
        } as typeof chrome;
    });
    afterAll(() => {
        global.chrome.action.setBadgeText = originalSetBadgeText;
        global.chrome.runtime.lastError = originalRuntimeError;
    });

    it('should resolve after color is correctly set', async () => {
        global.chrome.runtime.lastError = undefined;
        const details = { text: 'text' };
        const resolution = await setBadgeText(details);
        expect(resolution).toBeUndefined();
    });
    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        try {
            const details = { text: 'text' };
            await setBadgeText(details);
        } catch (error) {
            expect(error).toMatchObject({ message: 'error' });
        }
    });
});
