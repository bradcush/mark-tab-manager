import { MkBrowser } from 'src/api/MkBrowser';
import { MkStore } from 'src/storage/MkStore';
import { MkLoggerConstructor } from 'src/logs/MkLogger';

export interface MkContextMenu {
    connect(): void;
    create(): Promise<void>;
}

interface MkContextMenus {
    create: MkBrowser.contextMenus.Create;
    onClicked: MkBrowser.contextMenus.OnClicked;
    removeAll: MkBrowser.contextMenus.RemoveAll;
}

interface MkRuntime {
    lastError: MkBrowser.runtime.LastError;
}

export interface MkContextMenuBrowser {
    contextMenus: MkContextMenus;
    runtime: MkRuntime;
}

export interface MkConstructorParams {
    browser: MkContextMenuBrowser;
    store: MkStore;
    Logger: MkLoggerConstructor;
}

export interface MkHandleToggleParams {
    info: MkBrowser.contextMenus.OnClickedData;
    tab: MkBrowser.tabs.Tab | undefined;
}
