import { MkBrowser } from 'src/api/MkBrowser';
import { get as storageGet } from './browser/storage/sync/get';
import { set as storageSet } from './browser/storage/sync/set';
import { query as tabsQuery } from './browser/tabs/query';
import { Color as tabGroupsColor } from './browser/tabGroups/Color';
import { update as tabGroupsUpdate } from './browser/tabGroups/update';
import { query as tabGroupsQuery } from './browser/tabGroups/query';
import { group as tabsGroup } from './browser/tabs/group';
import { ungroup as tabsUngroup } from './browser/tabs/ungroup';

// For MV3 "browserAction" should be replaced by "action"
// https://developers.chrome.com/extensions/migrating_to_manifest_v3#actions
const action = {
    // @ts-expect-error Recent Manifest v3 change
    onClicked: chrome.action.onClicked,
    // @ts-expect-error Recent Manifest v3 change
    setBadgeBackgroundColor: chrome.action.setBadgeBackgroundColor,
    // @ts-expect-error Recent Manifest v3 change
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

const syncStorage = {
    get: storageGet,
    set: storageSet,
};

const storage = {
    sync: syncStorage,
};

// See the proposed API for tabGroups and tabs related to groups
// https://bugs.chromium.org/p/chromium/issues/detail?id=1106846
const tabGroups = {
    update: tabGroupsUpdate,
    query: tabGroupsQuery,
    Color: tabGroupsColor,
};

const tabs = {
    get: chrome.tabs.get,
    group: tabsGroup,
    move: chrome.tabs.move,
    onActivated: chrome.tabs.onActivated,
    onUpdated: chrome.tabs.onUpdated,
    onRemoved: chrome.tabs.onRemoved,
    query: tabsQuery,
    ungroup: tabsUngroup,
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
