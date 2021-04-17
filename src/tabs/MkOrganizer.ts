import { MkBrowser } from 'src/api/MkBrowser';
import { MkStore } from 'src/storage/MkStore';
import { MkLoggerConstructor } from 'src/logs/MkLogger';
import { MkCache } from 'src/storage/MkCache';
import { MkSorter } from './MkSorter';
import { MkGrouper } from './MkGrouper';

export interface MkOrganizer {
    connect(): void;
    organize(params?: MkOrganizeParams): Promise<void>;
}

interface MkBrowserAction {
    onClicked: MkBrowser.action.OnClicked;
}

interface MkBrowserRuntime {
    onInstalled: MkBrowser.runtime.OnInstalled;
}

interface MkBrowserTabs {
    onUpdated: MkBrowser.tabs.OnUpdated;
    onRemoved: MkBrowser.tabs.OnRemoved;
    query: MkBrowser.tabs.Query;
}

export interface MkOrganizerBrowser {
    action: MkBrowserAction;
    runtime: MkBrowserRuntime;
    tabs: MkBrowserTabs;
}

export interface MkContstructorParams {
    browser: MkOrganizerBrowser;
    cache: MkCache;
    tabsGrouper: MkGrouper;
    tabsSorter: MkSorter;
    store: MkStore;
    Logger: MkLoggerConstructor;
}

export interface MkIsGroupChanged {
    currentUrl: string;
    id: number;
}

export type MkOrganizerType = 'collapse' | 'default';

export interface MkOrganizeParams {
    tab?: MkBrowser.tabs.Tab;
    type?: MkOrganizerType;
}
