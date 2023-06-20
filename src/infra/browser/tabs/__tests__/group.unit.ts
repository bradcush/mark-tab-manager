import { tabsGroup } from '../group';

describe('tabsGroup', () => {
    const originalChrome = global.chrome;
    const groupMock = jest.fn();

    beforeEach(() => {
        // Mocking requires any assertion for setting tabGroups
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global.chrome as any) = {
            tabs: {
                group: groupMock.mockImplementation(
                    (
                        _options: chrome.tabs.GroupOptions,
                        callback: (groupId: number) => void
                    ) => {
                        const groupId = 2;
                        callback(groupId);
                    }
                ),
            },
            runtime: {},
        };
    });

    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should throw when group is lacking support', () => {
        // Setting tabGroups requires any
        // eslint-disable-next-line
        (global.chrome as any).tabs.group = undefined;
        global.chrome.runtime.lastError = undefined;
        const options = { tabIds: [1] };
        expect(() => {
            void tabsGroup(options);
        }).toThrow('No tabs.group support');
    });

    it('should resolve with group id after tab ids are grouped', async () => {
        global.chrome.runtime.lastError = undefined;
        const options = { tabIds: [1] };
        const groupId = await tabsGroup(options);
        expect(groupId).toBe(2);
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const options = { tabIds: [1] };
        await expect(tabsGroup(options)).rejects.toBe('error');
    });
});
