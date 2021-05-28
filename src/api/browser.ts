import { MkBrowser } from 'src/api/MkBrowser';
import { get as storageGet } from './browser/storage/sync/get';
import { set as storageSet } from './browser/storage/sync/set';
import { query as tabsQuery } from './browser/tabs/query';
import { makeColor as makeTabGroupsColor } from './browser/tabGroups/Color';
import { update as tabGroupsUpdate } from './browser/tabGroups/update';
import { query as tabGroupsQuery } from './browser/tabGroups/query';
import { group as tabsGroup } from './browser/tabs/group';
import { ungroup as tabsUngroup } from './browser/tabs/ungroup';
import { setBadgeBackgroundColor as actionSetBadgeBackgroundColor } from './browser/action/setBadgeBackgroundColor';
import { setBadgeText as actionSetBadgeText } from './browser/action/setBadgeText';
import { get as tabsGet } from './browser/tabs/get';
import { create as contextMenusCreate } from './browser/contextMenus/create';
import { move as tabsMove } from './browser/tabs/move';
import { setUninstallURL as runtimeSetUninstallUrl } from './browser/runtime/setUninstallURL';

const action = {
    onClicked: chrome.action.onClicked,
    setBadgeBackgroundColor: actionSetBadgeBackgroundColor,
    setBadgeText: actionSetBadgeText,
};

const contextMenus = {
    create: contextMenusCreate,
    onClicked: chrome.contextMenus.onClicked,
    removeAll: chrome.contextMenus.removeAll,
};

const management = {
    onEnabled: chrome.management.onEnabled,
};

const runtime = {
    id: chrome.runtime.id,
    onInstalled: chrome.runtime.onInstalled,
    setUninstallURL: runtimeSetUninstallUrl,
};

const syncStorage = {
    get: storageGet,
    set: storageSet,
};

const storage = {
    sync: syncStorage,
};

const tabGroups = {
    update: tabGroupsUpdate,
    query: tabGroupsQuery,
    Color: makeTabGroupsColor(),
};

const tabs = {
    get: tabsGet,
    group: tabsGroup,
    move: tabsMove,
    onUpdated: chrome.tabs.onUpdated,
    onRemoved: chrome.tabs.onRemoved,
    query: tabsQuery,
    ungroup: tabsUngroup,
};

export const browser: MkBrowser = {
    action,
    contextMenus,
    management,
    runtime,
    storage,
    tabGroups,
    tabs,
};
