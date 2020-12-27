import { MkBrowser } from 'src/api/MkBrowser';

export interface MkTabOrganizer {
    init(): void;
}

export interface MkToAddNewGroupParams {
    idx: number;
    tabIds: number[];
    name: string;
}

export interface MkToUpdateGroupTitleParams {
    // TODO: Properly type color as an enum when possible
    color: string;
    groupId: number;
    title: string;
}

interface MkToBrowserAction {
    onClicked: MkBrowser.action.OnClicked;
}

interface MkToBrowserRuntime {
    lastError: MkBrowser.runtime.LastError;
}

interface MkToBrowserStorage {
    sync: MkBrowser.storage.Sync;
}

interface MkToBrowserTabGroups {
    Color: MkBrowser.tabGroups.Color;
    update: MkBrowser.tabGroups.Update;
}

interface MkToBrowserTabs {
    group: MkBrowser.tabs.Group;
    move: MkBrowser.tabs.Move;
    onUpdated: MkBrowser.tabs.OnUpdated;
    query: MkBrowser.tabs.Query;
    ungroup: MkBrowser.tabs.Ungroup;
}

export interface MkToBrowser {
    action: MkToBrowserAction;
    runtime: MkToBrowserRuntime;
    storage: MkToBrowserStorage;
    tabGroups: MkToBrowserTabGroups;
    tabs: MkToBrowserTabs;
}
