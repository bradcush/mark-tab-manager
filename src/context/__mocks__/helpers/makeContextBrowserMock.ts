import { contextBrowserMock } from '../contextMenusBrowserMock';
import { MkMakeContextBrowserMockParams } from './MkMakeContextBrowserMock';

export function makeContextBrowserMock({
    removeAll = contextBrowserMock.contextMenus.removeAll,
    sync = contextBrowserMock.storage.sync,
}: MkMakeContextBrowserMockParams) {
    return {
        ...contextBrowserMock,
        contextMenus: {
            ...contextBrowserMock.contextMenus,
            removeAll,
        },
        storage: {
            ...contextBrowserMock.storage,
            sync,
        },
    };
}
