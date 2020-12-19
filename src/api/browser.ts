import { MkBrowser } from 'src/api/MkBrowser';

// For MV3 broserAction should be replaced by action
// but types don't yet support this change
// https://developers.chrome.com/extensions/migrating_to_manifest_v3#actions
const action = {
    // @ts-expect-error Due to recent MV3 API change
    onClicked: chrome.action.onClicked,
    // @ts-expect-error Due to recent MV3 API change
    setBadgeBackgroundColor: chrome.action.setBadgeBackgroundColor,
    // @ts-expect-error Due to recent MV3 API change
    setBadgeText: chrome.action.setBadgeText,
};

const bookmarks = {
    onCreated: chrome.bookmarks.onCreated,
    search: chrome.bookmarks.search,
};

const runtime = {
    // TODO: We shouldn't be passing with but instead
    // abstracting it away in our API implementation
    lastError: chrome.runtime.lastError,
};

const tabs = {
    get: chrome.tabs.get,
    move: chrome.tabs.move,
    onActivated: chrome.tabs.onActivated,
    onUpdated: chrome.tabs.onUpdated,
    query: chrome.tabs.query,
};

export const browser: MkBrowser = {
    action,
    bookmarks,
    runtime,
    tabs,
};
