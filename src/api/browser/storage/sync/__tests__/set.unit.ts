import { set } from '../set';
import { setMock } from '../mocks/set';

describe('set', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            storage: {
                sync: {
                    set: setMock,
                },
            },
            runtime: {},
        } as typeof chrome;
    });
    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should resolve after items are stored', async () => {
        global.chrome.runtime.lastError = undefined;
        const items = {
            settings: 'settings',
        };
        const resolution = await set(items);
        expect(resolution).toBeUndefined();
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const items = {
            settings: 'settings',
        };
        await expect(set(items)).rejects.toMatchObject({
            message: 'error',
        });
    });
});
