import { MkBrowser } from 'src/api/MkBrowser';
import { MkStorageService } from 'src/storage/MkStorageService';

export interface MkContextMenusService {
    init(): void;
}

interface MkCmBrowserContextMenus {
    create: MkBrowser.contextMenus.Create;
    onClicked: MkBrowser.contextMenus.OnClicked;
    removeAll: MkBrowser.contextMenus.RemoveAll;
}

interface MkCmBrowserRuntime {
    lastError: MkBrowser.runtime.LastError;
}

export interface MkCmBrowser {
    contextMenus: MkCmBrowserContextMenus;
    runtime: MkCmBrowserRuntime;
}

export interface MkCmConstructorParams {
    browser: MkCmBrowser;
    storage: MkStorageService;
}

export interface MkCmHandleToggleParams {
    info: MkBrowser.contextMenus.OnClickedData;
    tab: MkBrowser.tabs.Tab | undefined;
}
