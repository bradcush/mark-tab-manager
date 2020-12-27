import { browserMock } from 'src/api/__mocks__/browserMock';
import { MkToBrowser } from '../MkTabOrganizer';
import { makeQueryMock as makeTabsQueryMock } from 'src/api/__mocks__/browserMock/tabs/queryMock';
import { makeSyncMock as makeStorageSyncMock } from 'src/api/__mocks__/browserMock/storage/syncMock';
import { colorMock } from './organizerBrowserMock/tabGroups/colorMock';

const organizerBrowserAction = {
    onClicked: browserMock.action.onClicked,
};

const organizerBrowserRuntime = {
    lastError: browserMock.runtime.lastError,
};

const organizerBrowserStorage = {
    sync: makeStorageSyncMock({
        enableAutomaticSorting: true,
    }),
};

const organizerBrowserTabGroups = {
    Color: colorMock,
    update: jest.fn(),
};

const organizerBrowserTabs = {
    group: jest.fn(),
    move: jest.fn(),
    onUpdated: browserMock.tabs.onUpdated,
    query: makeTabsQueryMock([]),
    ungroup: jest.fn(),
};

export const organizerBrowserMock = ({
    action: organizerBrowserAction,
    runtime: organizerBrowserRuntime,
    storage: organizerBrowserStorage,
    tabGroups: organizerBrowserTabGroups,
    tabs: organizerBrowserTabs,
} as any) as MkToBrowser;
