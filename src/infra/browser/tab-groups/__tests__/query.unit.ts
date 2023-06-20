import { Color } from '../constants/colors';
import { tabGroupsQuery } from '../query';

const { BLUE } = Color;

describe('tabGroupsQuery', () => {
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
            void tabGroupsQuery(queryInfo);
        }).toThrow('No tabGroups.query support');
    });

    it('should resolve with matching groups for query match', async () => {
        // Setting tabGroups requires any
        // eslint-disable-next-line
        (global.chrome as any).tabGroups.query = queryMock.mockImplementation(
            (
                _queryInfo: chrome.tabGroups.QueryInfo,
                callback: (groups: chrome.tabGroups.TabGroup[]) => void
            ) => {
                const group = {
                    collapsed: false,
                    color: BLUE,
                    id: 2,
                    title: 'match',
                    windowId: 1,
                };
                callback([group]);
            }
        );
        global.chrome.runtime.lastError = undefined;
        const queryInfo = { title: 'match' };
        const groups = await tabGroupsQuery(queryInfo);
        expect(groups.length).toBe(1);
        expect(groups[0]).toMatchObject({
            collapsed: false,
            color: BLUE,
            id: 2,
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
        await expect(tabGroupsQuery(queryInfo)).rejects.toBe('error');
    });
});
