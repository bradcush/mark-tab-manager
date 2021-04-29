import { query } from '../query';
import { queryMock } from '../mocks/query';

describe('query', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            tabs: {
                query: queryMock,
            },
            runtime: {},
        } as typeof chrome;
    });
    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should resolve with tabs for query match', async () => {
        global.chrome.runtime.lastError = undefined;
        const queryInfo = { title: 'title' };
        const tabs = await query(queryInfo);
        expect(tabs[0]).toMatchObject({
            id: 1,
            windowId: 2,
        });
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const queryInfo = { title: 'title' };
        await expect(query(queryInfo)).rejects.toMatchObject({
            message: 'error',
        });
    });
});
