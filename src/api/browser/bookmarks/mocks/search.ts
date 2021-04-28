import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Mock function for testing the browser
 * API wrapped function directly
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
