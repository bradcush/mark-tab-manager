import { MkBrowser } from 'src/api/MkBrowser';

export interface MkContextMenusService {
    init(): void;
}

interface MkCmBrowserContextMenus {
    create: MkBrowser.contextMenus.Create;
    onClicked: MkBrowser.contextMenus.OnClicked;
}

interface MkCmBrowserRuntime {
    lastError: MkBrowser.runtime.LastError;
}

interface MkCmBrowserStorage {
    sync: MkBrowser.storage.Sync;
}

export interface MkCmBrowser {
    contextMenus: MkCmBrowserContextMenus;
    runtime: MkCmBrowserRuntime;
    storage: MkCmBrowserStorage;
}

export interface MkCmHandleToggleParams {
    info: MkBrowser.contextMenus.OnClickedData;
    tab: MkBrowser.tabs.Tab | undefined;
}
