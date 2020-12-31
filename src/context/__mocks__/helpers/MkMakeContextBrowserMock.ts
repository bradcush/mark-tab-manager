import { MkBrowser } from 'src/api/MkBrowser';

export interface MkMakeContextBrowserMockParams {
    removeAll?: MkBrowser.contextMenus.RemoveAll;
    sync?: MkBrowser.storage.Sync;
}
