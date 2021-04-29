import { move } from '../move';
import { moveMock } from '../mocks/move';

describe('tabs/move', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            tabs: {
                move: moveMock,
            },
            runtime: {},
        } as typeof chrome;
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
        await expect(move(tabId, moveProperties)).rejects.toMatchObject({
            message: 'error',
        });
    });
});
