import { MkBrowser } from 'src/api/MkBrowser';
import { MkLoggerConstructor } from 'src/logs/MkLogger';

export interface MkBookmarkCounter {
    connect(): void;
    setActiveTabBookmarkCount(): Promise<void>;
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
    lastError: MkBrowser.runtime.LastError;
}

interface MkBrowserTabs {
    get: MkBrowser.tabs.Get;
    onActivated: MkBrowser.tabs.OnActivated;
    onUpdated: MkBrowser.tabs.OnUpdated;
    query: MkBrowser.tabs.Query;
}

export interface MkBookmarkCounterBrowser {
    action: MkBrowserAction;
    bookmarks: MkBrowserBookmarks;
    runtime: MkBrowserRuntime;
    tabs: MkBrowserTabs;
}

export interface MkConstructorParams {
    browser: MkBookmarkCounterBrowser;
    Logger: MkLoggerConstructor;
}
