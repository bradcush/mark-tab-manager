import { browserMock } from 'src/api/__mocks__/browserMock';
import { MkCmBrowser } from '../MkContextMenusService';
import { makeSyncMock as makeStorageSyncMock } from 'src/api/__mocks__/browserMock/storage/syncMock';

const contextBrowserContextMenus = {
    create: browserMock.contextMenus.create,
    onClicked: browserMock.contextMenus.onClicked,
    removeAll: jest.fn(),
};

const contextBrowserRuntime = {
    runtime: browserMock.runtime.lastError,
};

const contextBrowserStorage = {
    sync: makeStorageSyncMock({}),
};

export const contextBrowserMock = ({
    contextMenus: contextBrowserContextMenus,
    runtime: contextBrowserRuntime,
    storage: contextBrowserStorage,
} as any) as MkCmBrowser;
