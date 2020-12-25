import { counterBrowserMock } from 'src/bookmarks/__mocks__/counterBrowserMock';
import { MkBrowser } from 'src/api/MkBrowser';

// TODO: Decide whether it's preferred to pass an entire mock or just the
// data it relies on as we currently do both throughout the code.
export function makeCounterBrowserMock(search: MkBrowser.bookmarks.Search) {
    return {
        ...counterBrowserMock,
        bookmarks: {
            ...counterBrowserMock.bookmarks,
            search,
        },
    };
}
