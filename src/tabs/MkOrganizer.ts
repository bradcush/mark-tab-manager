import { MkBrowser } from 'src/api/MkBrowser';
import { MkStore } from 'src/storage/MkStore';
import { MkLoggerConstructor } from 'src/logs/MkLogger';
import { MkCache } from 'src/storage/MkCache';

export interface MkOrganizer {
    connect(): void;
    isTabGroupingSupported(): boolean;
    organize(params?: MkOrganizeParams): Promise<void>;
    removeAllGroups(): Promise<void>;
}

interface MkBrowserAction {
    onClicked: MkBrowser.action.OnClicked;
}

interface MkBrowserRuntime {
    onInstalled: MkBrowser.runtime.OnInstalled;
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
    cache: MkCache;
    store: MkStore;
    Logger: MkLoggerConstructor;
}

export interface MkAddNewGroupParams {
    idx: number;
    forceCollapse: boolean;
    name: string;
    tabIds: number[];
    windowId: number;
}

export interface MkGetGroupInfoParams {
    title: string;
    id: number;
}

type MkOrganizerType = 'collapse' | 'default';

export interface MkOrganizeParams {
    tab?: MkBrowser.tabs.Tab;
    type?: MkOrganizerType;
}

export interface MkRenderTabGroups {
    organizeType: MkOrganizerType;
    tabs: MkBrowser.tabs.Tab[];
}

export type MkActiveTabIdsByWindowKey = number;
export type MkActiveTabIdsByWindowValue = number | undefined;
export type MkActiveTabIdsByWindow = Map<number, number | undefined>;

export interface MkTabIdsByGroup {
    [key: string]: Record<string, number[]>;
}

export interface MkRenderGroupsByNameParams {
    activeTabIdsByWindow: MkActiveTabIdsByWindow;
    type: MkOrganizerType;
    tabIdsByGroup: MkTabIdsByGroup;
}

export interface MkUpdateGroupTitleParams {
    collapsed: boolean;
    color: string;
    groupId: number;
    title: string;
}
