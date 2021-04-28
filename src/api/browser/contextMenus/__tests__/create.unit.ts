import { create } from '../create';
import { createMock } from '../mocks/create';

describe('create', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            contextMenus: {
                create: createMock,
            },
            runtime: {},
        } as typeof chrome;
    });
    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should resolve after menu item is created', async () => {
        global.chrome.runtime.lastError = undefined;
        const createProperties = {
            id: 'menuItem',
            title: 'menuItem',
        };
        const resolution = await create(createProperties);
        expect(resolution).toBeUndefined();
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const createProperties = {
            id: 'menuItem',
            title: 'menuItem',
        };
        await expect(create(createProperties)).rejects.toMatchObject({
            message: 'error',
        });
    });
});
