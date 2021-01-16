import { contextBrowserMock } from '../contextMenusBrowserMock';
import { MkBrowser } from 'src/api/MkBrowser';

export function makeContextBrowserMock(
    removeAll: MkBrowser.contextMenus.RemoveAll = contextBrowserMock
        .contextMenus.removeAll
) {
    return {
        ...contextBrowserMock,
        contextMenus: {
            ...contextBrowserMock.contextMenus,
            removeAll,
        },
    };
}
