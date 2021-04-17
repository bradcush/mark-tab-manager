import { MkStore } from 'src/storage/MkStore';
import { MkLoggerConstructor } from 'src/logs/MkLogger';
import { MkBrowser } from 'src/api/MkBrowser';
import { MkOrganizerType } from './MkOrganizer';

export interface MkGrouper {
    removeAllGroups(): Promise<void>;
    renderTabGroups(params: MkRenderTabGroups): Promise<void>;
    isSupported(): boolean;
}

interface MkBrowserTabGroups {
    Color: MkBrowser.tabGroups.Color;
    query: MkBrowser.tabGroups.Query;
    update: MkBrowser.tabGroups.Update;
}

interface MkBrowserTabs {
    group: MkBrowser.tabs.Group;
    query: MkBrowser.tabs.Query;
    ungroup: MkBrowser.tabs.Ungroup;
}

export interface MkGrouperBrowser {
    tabGroups: MkBrowserTabGroups;
    tabs: MkBrowserTabs;
}
export interface MkContstructorParams {
    browser: MkGrouperBrowser;
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

export interface MkRenderTabGroups {
    organizeType: MkOrganizerType;
    tabs: MkBrowser.tabs.Tab[];
}

export interface MkUpdateGroupTitleParams {
    collapsed: boolean;
    color: string;
    groupId: number;
    title: string;
}
