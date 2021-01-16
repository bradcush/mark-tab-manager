import { browserMock } from 'src/api/__mocks__/browserMock';
import { MkCmBrowser } from '../MkContextMenusService';

const contextBrowserContextMenus = {
    create: browserMock.contextMenus.create,
    onClicked: browserMock.contextMenus.onClicked,
    removeAll: jest.fn(),
};

const contextBrowserRuntime = {
    runtime: browserMock.runtime.lastError,
};

export const contextBrowserMock = ({
    contextMenus: contextBrowserContextMenus,
    runtime: contextBrowserRuntime,
} as any) as MkCmBrowser;
