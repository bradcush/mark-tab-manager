import { MkBrowser } from 'src/api/MkBrowser';

export interface MkBookmarkCounter {
    init(): void;
}

interface MkBcBrowserBookmarks {
    onCreated: MkBrowser.bookmarks.OnCreated;
    search: MkBrowser.bookmarks.Search;
}

interface MkBcBrowserAction {
    setBadgeBackgroundColor: MkBrowser.action.SetBadgeBackgroundColor;
    setBadgeText: MkBrowser.action.SetBadgeText;
}

interface MkBcBrowserRuntime {
    lastError: MkBrowser.runtime.LastError;
}

interface MkBcBrowserTabs {
    get: MkBrowser.tabs.Get;
    onActivated: MkBrowser.tabs.OnActivated;
    onUpdated: MkBrowser.tabs.OnUpdated;
    query: MkBrowser.tabs.Query;
}

export interface MkBcBrowser {
    action: MkBcBrowserAction;
    bookmarks: MkBcBrowserBookmarks;
    runtime: MkBcBrowserRuntime;
    tabs: MkBcBrowserTabs;
}
