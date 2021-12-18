import { setBadgeText } from '../setBadgeText';

describe('action/setBadgeText', () => {
    const originalChrome = global.chrome;
    const setBadgeTextMock = jest.fn();

    beforeEach(() => {
        global.chrome = ({
            action: {
                setBadgeText: setBadgeTextMock.mockImplementation(
                    (
                        _details: chrome.action.BadgeTextDetails,
                        callback: () => void
                    ) => {
                        callback();
                    }
                ),
            },
            runtime: {},
        } as unknown) as typeof chrome;
    });
    afterEach(() => {
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
        const details = { text: 'text' };
        await expect(setBadgeText(details)).rejects.toBe('error');
    });
});
