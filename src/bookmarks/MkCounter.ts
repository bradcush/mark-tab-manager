import { MkBrowser } from 'src/api/MkBrowser';
import { MkLoggerConstructor } from 'src/logs/MkLogger';

export interface MkCounter {
    connect(): void;
}

interface MkBrowserBookmarks {
    onCreated: MkBrowser.bookmarks.OnCreated;
    search: MkBrowser.bookmarks.Search;
}

interface MkBrowserAction {
    setBadgeBackgroundColor: MkBrowser.action.SetBadgeBackgroundColor;
    setBadgeText: MkBrowser.action.SetBadgeText;
}

interface MkBrowserRuntime {
    onInstalled: MkBrowser.runtime.OnInstalled;
}

interface MkBrowserTabs {
    get: MkBrowser.tabs.Get;
    onActivated: MkBrowser.tabs.OnActivated;
    onUpdated: MkBrowser.tabs.OnUpdated;
    query: MkBrowser.tabs.Query;
}

export interface MkCounterBrowser {
    action: MkBrowserAction;
    bookmarks: MkBrowserBookmarks;
    runtime: MkBrowserRuntime;
    tabs: MkBrowserTabs;
}

export interface MkConstructorParams {
    browser: MkCounterBrowser;
    Logger: MkLoggerConstructor;
}
