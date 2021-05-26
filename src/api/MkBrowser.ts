import { MkSyncGetKeys, MkSyncItems } from './browser/storage/sync/MkSync';
import { MkColor as MkTabGroupsColor } from './browser/tabGroups/MkColor';
import { MkUpdateProperties as MkTabGroupsUpdateProperties } from './browser/tabGroups/MkUpdate';
import { MkOptions as MkTabsGroupOptions } from './browser/tabs/MkGroup';
import { MkQueryInfo as MkTabGroupsQueryInfo } from './browser/tabGroups/MkQuery';

interface MkBrowserAction {
    onClicked: MkBrowser.action.OnClicked;
    setBadgeBackgroundColor: MkBrowser.action.SetBadgeBackgroundColor;
    setBadgeText: MkBrowser.action.SetBadgeText;
}

interface MkBrowserContextMenus {
    create: MkBrowser.contextMenus.Create;
    onClicked: MkBrowser.contextMenus.OnClicked;
    removeAll: MkBrowser.contextMenus.RemoveAll;
}

interface MkBrowserManagement {
    onEnabled: MkBrowser.management.OnEnabled;
}

interface MkBrowserRuntime {
    id: MkBrowser.runtime.Id;
    onInstalled: MkBrowser.runtime.OnInstalled;
}

interface MkBrowserStorageSync {
    get: MkBrowser.storage.sync.Get;
    set: MkBrowser.storage.sync.Set;
}

interface MkBrowserStorage {
    sync: MkBrowserStorageSync;
}

interface MkBrowserTabGroups {
    Color: MkBrowser.tabGroups.Color;
    query: MkBrowser.tabGroups.Query;
    update: MkBrowser.tabGroups.Update;
}

interface MkBrowserTabs {
    get: MkBrowser.tabs.Get;
    group: MkBrowser.tabs.Group;
    move: MkBrowser.tabs.Move;
    onUpdated: MkBrowser.tabs.OnUpdated;
    onRemoved: MkBrowser.tabs.OnRemoved;
    query: MkBrowser.tabs.Query;
    ungroup: MkBrowser.tabs.Ungroup;
}

export interface MkBrowser {
    action: MkBrowserAction;
    contextMenus: MkBrowserContextMenus;
    management: MkBrowserManagement;
    runtime: MkBrowserRuntime;
    storage: MkBrowserStorage;
    tabGroups: MkBrowserTabGroups;
    tabs: MkBrowserTabs;
}

export declare namespace MkBrowser.action {
    export type BadgeBackgroundColorDetails = chrome.browserAction.BadgeBackgroundColorDetails;
    export type BadgeTextDetails = chrome.browserAction.BadgeTextDetails;
    export type OnClicked = typeof chrome.browserAction.onClicked;
    export type SetBadgeBackgroundColor = (
        details: MkBrowser.action.BadgeBackgroundColorDetails
    ) => Promise<void>;
    export type SetBadgeText = (
        details: MkBrowser.action.BadgeTextDetails
    ) => Promise<void>;
}

export declare namespace MkBrowser.contextMenus {
    export type Create = (
        createProperties: MkBrowser.contextMenus.CreateProperties
    ) => Promise<void>;
    export type CreateProperties = chrome.contextMenus.CreateProperties;
    export type OnClicked = typeof chrome.contextMenus.onClicked;
    export type OnClickedData = chrome.contextMenus.OnClickData;
    export type RemoveAll = typeof chrome.contextMenus.removeAll;
}

export declare namespace MkBrowser.management {
    export type OnEnabled = typeof chrome.management.onEnabled;
}

export declare namespace MkBrowser.runtime {
    export type Id = typeof chrome.runtime.id;
    export type OnInstalled = typeof chrome.runtime.onInstalled;
}

export declare namespace MkBrowser.storage.sync {
    export type Get = (keys: MkSyncGetKeys) => Promise<MkSyncItems>;
    export type Set = (items: MkSyncItems) => Promise<void>;
}

export declare namespace MkBrowser.storage {
    export interface Sync {
        get: MkBrowser.storage.sync.Get;
        set: MkBrowser.storage.sync.Set;
    }
}

export declare namespace MkBrowser.tabGroups {
    export type Color = MkTabGroupsColor;
    export type Query = (
        queryInfo: MkTabGroupsQueryInfo
    ) => Promise<MkBrowser.tabGroups.TabGroup[]>;
    export interface TabGroup {
        collapsed: boolean;
        color: MkTabGroupsColor;
        title: string;
        windowId: number;
    }
    export type Update = (
        groupId: number,
        updateProperties: MkTabGroupsUpdateProperties
    ) => Promise<void>;
}

export declare namespace MkBrowser.tabs {
    export type ChangeInfo = chrome.tabs.TabChangeInfo;
    export type Get = (id: number) => Promise<MkBrowser.tabs.Tab>;
    export type Group = (options: MkTabsGroupOptions) => Promise<number>;
    export type Move = (
        id: number,
        moveProperties: MkBrowser.tabs.MoveProperties
    ) => Promise<void>;
    export type MoveProperties = chrome.tabs.MoveProperties;
    export type OnUpdated = typeof chrome.tabs.onUpdated;
    export type OnRemoved = typeof chrome.tabs.onRemoved;
    export type Query = (
        queryInfo: MkBrowser.tabs.QueryInfo
    ) => Promise<MkBrowser.tabs.Tab[]>;
    export type QueryInfo = chrome.tabs.QueryInfo;
    export type Tab = chrome.tabs.Tab;
    export type TabActiveInfo = chrome.tabs.TabActiveInfo;
    export type Ungroup = (tabIds: number[]) => Promise<void>;
}
