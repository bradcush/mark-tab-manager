import { query } from '../query';
import { MkColor } from '../MkColor';
import { MkQueryInfo, MkTabGroup } from '../MkQuery';

const { BLUE } = MkColor;

describe('tabGroups/query', () => {
    const originalChrome = global.chrome;
    const queryMock = jest.fn();

    beforeEach(() => {
        // Mocking requires any assertion for setting tabGroups
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global.chrome as any) = {
            tabGroups: {},
            runtime: {},
        };
    });
    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should throw when query is lacking support', () => {
        // Setting tabGroups requires any
        // eslint-disable-next-line
        (global.chrome as any).tabGroups = undefined;
        global.chrome.runtime.lastError = undefined;
        const queryInfo = { title: 'title' };
        expect(() => {
            void query(queryInfo);
        }).toThrow('No tabGroups.query support');
    });

    it('should resolve with matching groups for query match', async () => {
        // Setting tabGroups requires any
        // eslint-disable-next-line
        (global.chrome as any).tabGroups.query = queryMock.mockImplementation(
            (
                _queryInfo: MkQueryInfo,
                callback: (groups: MkTabGroup[]) => void
            ) => {
                const group = {
                    collapsed: false,
                    color: BLUE,
                    title: 'match',
                    windowId: 1,
                };
                callback([group]);
            }
        );
        global.chrome.runtime.lastError = undefined;
        const queryInfo = { title: 'match' };
        const groups = await query(queryInfo);
        expect(groups.length).toBe(1);
        expect(groups[0]).toMatchObject({
            collapsed: false,
            color: BLUE,
            title: 'match',
            windowId: 1,
        });
    });

    it('should reject with error if one exists', async () => {
        // Setting tabGroups requires any
        // eslint-disable-next-line
        (global.chrome as any).tabGroups.query = queryMock;
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const queryInfo = { title: 'title' };
        await expect(query(queryInfo)).rejects.toMatchObject({
            message: 'error',
        });
    });
});
