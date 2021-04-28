import { search } from '../search';
import { searchMock } from '../mocks/search';

describe('search', () => {
    const originalChrome = global.chrome;

    beforeEach(() => {
        global.chrome = {
            bookmarks: {
                search: searchMock,
            },
            runtime: {},
        } as typeof chrome;
    });
    afterEach(() => {
        global.chrome = originalChrome;
    });

    it('should resolve with bookmarks for given query', async () => {
        global.chrome.runtime.lastError = undefined;
        const query = 'title';
        const results = await search(query);
        expect(results[0]).toMatchObject({
            id: 'id',
            title: 'title',
        });
    });

    it('should reject with error if one exists', async () => {
        global.chrome.runtime.lastError = {
            message: 'error',
        };
        const key = 'settings';
        await expect(search(key)).rejects.toMatchObject({
            message: 'error',
        });
    });
});
