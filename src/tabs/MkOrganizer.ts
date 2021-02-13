import { MkBrowser } from 'src/api/MkBrowser';
import { MkStore } from 'src/storage/MkStore';
import { MkLoggerConstructor } from 'src/logs/MkLogger';

export interface MkOrganizer {
    connect(): void;
    organize(): void;
}

interface MkBrowserAction {
    onClicked: MkBrowser.action.OnClicked;
}

interface MkBrowserRuntime {
    lastError: MkBrowser.runtime.LastError;
}

interface MkBrowserStorage {
    sync: MkBrowser.storage.Sync;
}

interface MkBrowserTabGroups {
    Color: MkBrowser.tabGroups.Color;
    query: MkBrowser.tabGroups.Query;
    update: MkBrowser.tabGroups.Update;
}

interface MkBrowserTabs {
    group: MkBrowser.tabs.Group;
    move: MkBrowser.tabs.Move;
    onUpdated: MkBrowser.tabs.OnUpdated;
    onRemoved: MkBrowser.tabs.OnRemoved;
    query: MkBrowser.tabs.Query;
    ungroup: MkBrowser.tabs.Ungroup;
}

export interface MkOrganizerBrowser {
    action: MkBrowserAction;
    runtime: MkBrowserRuntime;
    storage: MkBrowserStorage;
    tabGroups: MkBrowserTabGroups;
    tabs: MkBrowserTabs;
}

export interface MkContstructorParams {
    browser: MkOrganizerBrowser;
    store: MkStore;
    Logger: MkLoggerConstructor;
}

export interface MkAddNewGroupParams {
    idx: number;
    name: string;
    tabIds: number[];
    windowId: number;
}

export interface MkGetGroupInfoParams {
    title: string;
    id: number;
}

export interface MkUpdateGroupTitleParams {
    collapsed: boolean;
    color: string;
    groupId: number;
    title: string;
}

export interface MkTabIdsByDomain {
    [key: string]: Record<string, number[]>;
}
