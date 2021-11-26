import { ungroup } from '../ungroup';

describe('tabs/ungroup', () => {
    const originalChrome = global.chrome;
    const ungroupMock = jest.fn();

    beforeEach(() => {
        // Mocking requires any assertion for setting tabGroups
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global.chrome as any) = {
            tabs: {
                ungroup: ungroupMock.mockImplementation(
                    (_tabIds: number[], callback: () => void) => {
                        callback();
                    }
                ),
            },
            runtime: {},
        };
    });
    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should throw when ungroup is lacking support', () => {
        // Setting tabGroups requires any
        // eslint-disable-next-line
        (global.chrome as any).tabs.ungroup = undefined;
        global.chrome.runtime.lastError = undefined;
        const tabIds = [1];
        expect(() => {
            void ungroup(tabIds);
        }).toThrow('No tabs.ungroup support');
    });

    it('should resolve after tab ids are ungrouped', async () => {
        global.chrome.runtime.lastError = undefined;
        const tabIds = [1];
        const resolution = await ungroup(tabIds);
        expect(resolution).toBeUndefined();
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const tabIds = [1];
        await expect(ungroup(tabIds)).rejects.toMatchObject({
            message: 'error',
        });
    });
});
