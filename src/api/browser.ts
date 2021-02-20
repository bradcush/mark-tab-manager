import { MkBrowser } from 'src/api/MkBrowser';
import { get as storageGet } from './browser/storage/sync/get';
import { set as storageSet } from './browser/storage/sync/set';
import { query as tabsQuery } from './browser/tabs/query';
import { Color as tabGroupsColor } from './browser/tabGroups/Color';
import { update as tabGroupsUpdate } from './browser/tabGroups/update';
import { query as tabGroupsQuery } from './browser/tabGroups/query';
import { group as tabsGroup } from './browser/tabs/group';
import { ungroup as tabsUngroup } from './browser/tabs/ungroup';
import { setBadgeBackgroundColor as actionSetBadgeBackgroundColor } from './browser/action/setBadgeBackgroundColor';
import { setBadgeText as actionSetBadgeText } from './browser/action/setBadgeText';
import { search as bookmarksSearch } from './browser/bookmarks/search';
import { get as tabsGet } from './browser/tabs/get';
import { create as contextMenusCreate } from './browser/contextMenus/create';
import { move as tabsMove } from './browser/tabs/move';

const action = {
    // @ts-expect-error Recent Manifest v3 change
    onClicked: chrome.action.onClicked,
    setBadgeBackgroundColor: actionSetBadgeBackgroundColor,
    setBadgeText: actionSetBadgeText,
};

const bookmarks = {
    onCreated: chrome.bookmarks.onCreated,
    search: bookmarksSearch,
};

const contextMenus = {
    create: contextMenusCreate,
    onClicked: chrome.contextMenus.onClicked,
    removeAll: chrome.contextMenus.removeAll,
};

const runtime = {
    onInstalled: chrome.runtime.onInstalled,
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
    get: tabsGet,
    group: tabsGroup,
    move: tabsMove,
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
