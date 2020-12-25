import { contextBrowserMock } from '../contextMenusBrowserMock';
import { MkBrowser } from 'src/api/MkBrowser';

export function makeContextBrowserMock(sync: MkBrowser.storage.Sync) {
    return {
        ...contextBrowserMock,
        storage: {
            ...contextBrowserMock.storage,
            sync,
        },
    };
}
