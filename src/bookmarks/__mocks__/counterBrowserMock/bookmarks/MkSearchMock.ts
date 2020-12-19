import { MkBrowser } from 'src/api/MkBrowser';

export type MkSearchMockCallback = (
    results: MkBrowser.bookmarks.BookmarkTreeNode[]
) => void;
