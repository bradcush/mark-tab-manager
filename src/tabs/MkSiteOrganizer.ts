import { MkBrowser } from 'src/api/MkBrowser';
import { MkStore } from 'src/storage/MkStore';
import { MkLoggerConstructor } from 'src/logs/MkLogger';

export interface MkSiteOrganizer {
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

export interface MkSiteOrganizerBrowser {
    action: MkBrowserAction;
    runtime: MkBrowserRuntime;
    storage: MkBrowserStorage;
    tabGroups: MkBrowserTabGroups;
    tabs: MkBrowserTabs;
}

export interface MkContstructorParams {
    browser: MkSiteOrganizerBrowser;
    store: MkStore;
    Logger: MkLoggerConstructor;
}

export interface MkAddNewGroupParams {
    idx: number;
    tabIds: number[];
    name: string;
}

export interface MkUpdateGroupTitleParams {
    color: string;
    groupId: number;
    title: string;
}
