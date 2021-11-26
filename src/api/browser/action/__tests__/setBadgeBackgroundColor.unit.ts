import { setBadgeBackgroundColor } from '../setBadgeBackgroundColor';

describe('action/setBadgeBackgroundColor', () => {
    const originalChrome = global.chrome;
    const setBadgeBackgroundColorMock = jest.fn();

    beforeEach(() => {
        global.chrome = ({
            action: {
                setBadgeBackgroundColor: setBadgeBackgroundColorMock.mockImplementation(
                    (
                        _details: chrome.action.BadgeBackgroundColorDetails,
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
        const details = { color: '#000' };
        const resolution = await setBadgeBackgroundColor(details);
        expect(resolution).toBeUndefined();
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const details = { color: '#000' };
        await expect(setBadgeBackgroundColor(details)).rejects.toMatchObject({
            message: 'error',
        });
    });
});
