import { browser } from 'src/api/browser';

export const bookmarkCounterBrowser = {
    action: {
        setBadgeBackgroundColor: browser.action.setBadgeBackgroundColor,
        setBadgeText: browser.action.setBadgeText,
    },
    bookmarks: {
        onCreated: browser.bookmarks.onCreated,
        search: browser.bookmarks.search,
    },
    runtime: {
        lastError: browser.runtime.lastError,
    },
    tabs: {
        get: browser.tabs.get,
        onActivated: browser.tabs.onActivated,
        onUpdated: browser.tabs.onUpdated,
        query: browser.tabs.query,
    },
};
