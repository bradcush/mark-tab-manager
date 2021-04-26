import { setBadgeBackgroundColor } from '../setBadgeBackgroundColor';
import { setBadgeBackgroundColorMock } from './mocks/setBadgeBackgroundColor';

describe('setBadgeBackgroundColor', () => {
    const originalSetBadgeBackgroundColor =
        global.chrome?.action?.setBadgeBackgroundColor;
    const originalRuntimeError = global.chrome?.runtime?.lastError;

    beforeAll(() => {
        global.chrome = {
            action: {
                setBadgeBackgroundColor: setBadgeBackgroundColorMock,
            },
            runtime: {},
        } as typeof chrome;
    });
    afterAll(() => {
        global.chrome.action.setBadgeBackgroundColor = originalSetBadgeBackgroundColor;
        global.chrome.runtime.lastError = originalRuntimeError;
    });

    it('should resolve after color is correctly set', async () => {
        global.chrome.runtime.lastError = undefined;
        const details = { color: '#000' };
        const resolution = await setBadgeBackgroundColor(details);
        expect(resolution).toBeUndefined();
    });
    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        try {
            const details = { color: '#000' };
            await setBadgeBackgroundColor(details);
        } catch (error) {
            expect(error).toMatchObject({ message: 'error' });
        }
    });
});
