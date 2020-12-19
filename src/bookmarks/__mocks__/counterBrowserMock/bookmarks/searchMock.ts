import { MkSearchMockCallback } from './MkSearchMock';
import { MkBrowser } from 'src/api/MkBrowser';

export function makeSearchMock(
    results: MkBrowser.bookmarks.BookmarkTreeNode[]
) {
    return (
        _query: MkBrowser.bookmarks.BookmarkSearchQuery,
        callback: MkSearchMockCallback
    ) => {
        callback(results);
    };
}
