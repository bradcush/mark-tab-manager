import { counterBrowserMock } from 'src/bookmarks/__mocks__/counterBrowserMock';
import { MkBrowser } from 'src/api/MkBrowser';

export function makeCounterBrowserMock(search: MkBrowser.bookmarks.Search) {
    return {
        ...counterBrowserMock,
        bookmarks: {
            ...counterBrowserMock.bookmarks,
            search,
        },
    };
}
