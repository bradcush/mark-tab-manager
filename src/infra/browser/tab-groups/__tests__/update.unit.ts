import { tabGroupsUpdate } from '../update';

describe('tabGroupsUpdate', () => {
    const originalChrome = global.chrome;
    const updateMock = jest.fn();

    beforeEach(() => {
        // Mocking requires any assertion for setting tabGroups
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global.chrome as any) = {
            tabGroups: {
                update: updateMock.mockImplementation(
                    (
                        _groupId: number,
                        _updateProperties: chrome.tabGroups.UpdateProperties,
                        callback: () => void
                    ) => {
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

    it('should throw when update is lacking support', () => {
        // Setting tabGroups requires any
        // eslint-disable-next-line
        (global.chrome as any).tabGroups = undefined;
        global.chrome.runtime.lastError = undefined;
        const groupId = 1;
        const updateProperties = { title: 'title' };
        expect(() => {
            void tabGroupsUpdate(groupId, updateProperties);
        }).toThrow('No tabGroups.update support');
    });

    it('should resolve after group is updated', async () => {
        global.chrome.runtime.lastError = undefined;
        const groupId = 1;
        const updateProperties = { title: 'title' };
        const resolution = await tabGroupsUpdate(groupId, updateProperties);
        expect(resolution).toBeUndefined();
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const groupId = 1;
        const updateProperties = { title: 'title' };
        await expect(tabGroupsUpdate(groupId, updateProperties)).rejects.toBe(
            'error'
        );
    });
});
