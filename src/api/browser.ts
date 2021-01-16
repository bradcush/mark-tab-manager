import { MkBrowser } from 'src/api/MkBrowser';
import { get as storageSyncGet } from './browser/storage/sync/syncGet';
import { set as storageSyncSet } from './browser/storage/sync/syncSet';

// For MV3 browserAction should be replaced by action
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

const contextMenus = {
    create: chrome.contextMenus.create,
    onClicked: chrome.contextMenus.onClicked,
    removeAll: chrome.contextMenus.removeAll,
};

const runtime = {
    // TODO: We shouldn't be passing with but instead
    // abstracting it away in our API implementation
    lastError: chrome.runtime.lastError,
};

const storageSync = {
    get: storageSyncGet,
    set: storageSyncSet,
};

const storage = {
    sync: storageSync,
};

// See the proposed API for tabGroups and tabs related to groups
// https://bugs.chromium.org/p/chromium/issues/detail?id=1106846
const tabGroups = {
    // @ts-expect-error Still in preview
    update: chrome.tabGroups.update,
    // @ts-expect-error Still in preview
    Color: chrome.tabGroups.Color,
};

const tabs = {
    get: chrome.tabs.get,
    // @ts-expect-error Still in preview
    group: chrome.tabs.group,
    move: chrome.tabs.move,
    onActivated: chrome.tabs.onActivated,
    onUpdated: chrome.tabs.onUpdated,
    query: chrome.tabs.query,
    // @ts-expect-error Still in preview
    ungroup: chrome.tabs.ungroup,
};

export const browser: MkBrowser = {
    action,
    bookmarks,
    contextMenus,
    runtime,
    storage,
    tabGroups,
    tabs,
};
