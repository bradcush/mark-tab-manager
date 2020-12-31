import { MkBrowser } from 'src/api/MkBrowser';
import { MkAddToQueue, MkQueuedFuncCallback } from 'src/helpers/MkMakeQueue';

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

interface MkCmBrowserStorage {
    sync: MkBrowser.storage.Sync;
}

export interface MkCmBrowser {
    contextMenus: MkCmBrowserContextMenus;
    runtime: MkCmBrowserRuntime;
    storage: MkCmBrowserStorage;
}

export interface MkCmConstructorParams {
    addToQueue: MkAddToQueue;
    browser: MkCmBrowser;
}

export interface MkCmCreateMenuItemParams {
    initialState: unknown;
    callback: MkQueuedFuncCallback;
}

export interface MkCmSetMenuItemParams {
    isChecked: unknown;
    callback: MkQueuedFuncCallback;
}

export interface MkCmHandleToggleParams {
    info: MkBrowser.contextMenus.OnClickedData;
    tab: MkBrowser.tabs.Tab | undefined;
}
