import { browserMock } from 'src/api/__mocks__/browserMock';
import { MkToBrowser } from '../MkTabOrganizer';
import { makeQueryMock as makeTabsQueryMock } from 'src/api/__mocks__/browserMock/tabs/queryMock';
import { makeSyncMock as makeStorageSyncMock } from 'src/api/__mocks__/browserMock/storage/syncMock';

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

const organizerBrowserTabs = {
    move: jest.fn(),
    onUpdated: browserMock.tabs.onUpdated,
    query: makeTabsQueryMock([]),
};

export const organizerBrowserMock = ({
    action: organizerBrowserAction,
    runtime: organizerBrowserRuntime,
    storage: organizerBrowserStorage,
    tabs: organizerBrowserTabs,
} as any) as MkToBrowser;
