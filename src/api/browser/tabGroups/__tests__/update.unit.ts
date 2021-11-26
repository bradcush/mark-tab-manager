import { update } from '../update';
import { MkUpdateProperties } from '../MkUpdate';

describe('tabGroups/update', () => {
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
                        _updateProperties: MkUpdateProperties,
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
            void update(groupId, updateProperties);
        }).toThrow('No tabGroups.update support');
    });

    it('should resolve after group is updated', async () => {
        global.chrome.runtime.lastError = undefined;
        const groupId = 1;
        const updateProperties = { title: 'title' };
        const resolution = await update(groupId, updateProperties);
        expect(resolution).toBeUndefined();
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const groupId = 1;
        const updateProperties = { title: 'title' };
        await expect(update(groupId, updateProperties)).rejects.toMatchObject({
            message: 'error',
        });
    });
});
