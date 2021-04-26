import { setBadgeText } from '../setBadgeText';
import { setBadgeTextMock } from './mocks/setBadgeText';

describe('setBadgeText', () => {
    const originalChrome = global.chrome;

    beforeAll(() => {
        global.chrome = {
            action: {
                setBadgeText: setBadgeTextMock,
            },
            runtime: {},
        } as typeof chrome;
    });
    afterAll(() => {
        global.chrome = originalChrome;
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
