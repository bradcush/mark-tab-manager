import { move } from '../move';

describe('tabs/move', () => {
    const originalChrome = global.chrome;
    const moveMock = jest.fn();

    beforeEach(() => {
        global.chrome = {
            tabs: {
                move: moveMock.mockImplementation(
                    (
                        _id: number,
                        _moveProperties: chrome.tabs.MoveProperties,
                        callback: () => void
                    ) => {
                        callback();
                    }
                ),
            },
            runtime: {},
        } as unknown as typeof chrome;
    });
    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should resolve after moving a given tab', async () => {
        global.chrome.runtime.lastError = undefined;
        const tabId = 1;
        const moveProperties = { index: -1 };
        const resolution = await move(tabId, moveProperties);
        expect(resolution).toBeUndefined();
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const tabId = 1;
        const moveProperties = { index: -1 };
        await expect(move(tabId, moveProperties)).rejects.toBe('error');
    });
});
