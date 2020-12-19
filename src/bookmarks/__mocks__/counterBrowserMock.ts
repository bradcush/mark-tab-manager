import { browserMock } from 'src/api/__mocks__/browserMock';
import { MkBcBrowser } from '../MkBookmarkCounter';
import { getMock as tabsGetMock } from './counterBrowserMock/tabs/getMock';
import { makeQueryMock as tabsMakeQueryMock } from 'src/api/__mocks__/browserMock/tabs/queryMock';
import { makeSearchMock as makeBookmarksSearchMock } from './counterBrowserMock/bookmarks/searchMock';
import { MkBrowser } from 'src/api/MkBrowser';

const counterBrowserAction = {
    setBadgeBackgroundColor: browserMock.action.setBadgeBackgroundColor,
    setBadgeText: browserMock.action.setBadgeText,
};

const counterBrowserBookmarks = {
    onCreated: browserMock.bookmarks.onCreated,
    search: makeBookmarksSearchMock([]),
};

const counterBrowserRuntime = {
    lastError: browserMock.runtime.lastError,
};

const queryTab = {
    url: 'https://second.com',
};

const counterBrowserTabs = {
    get: tabsGetMock,
    onUpdated: browserMock.tabs.onUpdated,
    onActivated: browserMock.tabs.onActivated,
    query: tabsMakeQueryMock([queryTab] as MkBrowser.tabs.Tab[]),
};

export const counterBrowserMock = ({
    action: counterBrowserAction,
    bookmarks: counterBrowserBookmarks,
    runtime: counterBrowserRuntime,
    tabs: counterBrowserTabs,
} as any) as MkBcBrowser;
