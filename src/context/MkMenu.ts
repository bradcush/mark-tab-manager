import { MkBrowser } from 'src/api/MkBrowser';
import { MkStore } from 'src/storage/MkStore';
import { MkLoggerConstructor } from 'src/logs/MkLogger';
import { MkOrganizer as MkTabsOrganizer } from 'src/tabs/MkOrganizer';
import { MkGrouper as MkTabsGrouper } from 'src/tabs/MkGrouper';

export interface MkMenu {
    connect(): void;
}

export interface MkConstructorParams {
    store: MkStore;
    tabsGrouper: MkTabsGrouper;
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
