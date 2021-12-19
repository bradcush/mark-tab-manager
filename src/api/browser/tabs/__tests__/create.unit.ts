import { create } from '../create';

describe('tabs/create', () => {
    const originalChrome = global.chrome;
    const createMock = jest.fn();

    beforeEach(() => {
        global.chrome = ({
            tabs: {
                create: createMock.mockImplementation(
                    (
                        _createProerties: chrome.tabs.CreateProperties,
                        callback: (tab: chrome.tabs.Tab) => void
                    ) => {
                        const tab = {
                            id: 1,
                        } as chrome.tabs.Tab;
                        callback(tab);
                    }
                ),
            },
            runtime: {},
        } as unknown) as typeof chrome;
    });
    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should resolve after creating a new tab', async () => {
        global.chrome.runtime.lastError = undefined;
        const createProperties = { url: 'https://example.com' };
        const resolution = await create(createProperties);
        expect(resolution).toMatchObject({ id: 1 });
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const createProperties = { url: 'https://example.com' };
        await expect(create(createProperties)).rejects.toBe('error');
    });
});
