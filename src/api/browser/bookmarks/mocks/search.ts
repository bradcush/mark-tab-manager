import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Mock bookmarks.search for
 * mapped api testing
 */
export function searchMock(
    _query: string,
    callback?: (results: MkBrowser.bookmarks.BookmarkTreeNode[]) => void
): void {
    if (!callback) {
        return;
    }
    const result = {
        id: 'id',
        title: 'title',
    };
    callback([result]);
}
