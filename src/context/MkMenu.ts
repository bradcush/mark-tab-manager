import { MkBrowser } from 'src/api/MkBrowser';
import { MkStore } from 'src/storage/MkStore';
import { MkLoggerConstructor } from 'src/logs/MkLogger';
import { MkOrganizer as MkTabsOrganizer } from 'src/tabs/MkOrganizer';

export interface MkMenu {
    connect(): void;
}

interface MkContextMenus {
    create: MkBrowser.contextMenus.Create;
    onClicked: MkBrowser.contextMenus.OnClicked;
    removeAll: MkBrowser.contextMenus.RemoveAll;
}

interface MkRuntime {
    lastError: MkBrowser.runtime.LastError;
    onInstalled: MkBrowser.runtime.OnInstalled;
}

export interface MkMenuBrowser {
    contextMenus: MkContextMenus;
    runtime: MkRuntime;
}

export interface MkConstructorParams {
    browser: MkMenuBrowser;
    store: MkStore;
    tabsOrganizer: MkTabsOrganizer;
    Logger: MkLoggerConstructor;
}

export interface MkHandleToggleParams {
    info: MkBrowser.contextMenus.OnClickedData;
    tab: MkBrowser.tabs.Tab | undefined;
}

export interface MkMakeCheckboxPropertiesParams {
    identifier: string;
    checked: boolean;
    labelId: string;
    text: string;
}

export interface MkCreateCheckboxParams {
    id: string;
    isChecked: boolean;
    parentId: string;
    title: string;
}
