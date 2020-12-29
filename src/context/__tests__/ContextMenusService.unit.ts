import {
    browserMockRemoveListeners,
    browserMockListeners,
} from 'src/api/__mocks__/browserMockListeners';
import { browserMockTriggers } from 'src/api/__mocks__/browserMock';
import { MkBrowser } from 'src/api/MkBrowser';
import { ContextMenusService } from '../ContextMenusService';
import { contextBrowserMock } from '../__mocks__/contextMenusBrowserMock';
import { makeContextBrowserMock } from '../__mocks__/helpers/makeContextBrowserMock';
import { makeSyncMock } from 'src/api/__mocks__/browserMock/storage/syncMock';
import { removeAllMock as contextMenusRemoveAllMock } from '../__mocks__/contextMenusBrowserMock/contextMenus/removeAllMock';
import { makeQueueMock } from 'src/helpers/__mocks__/makeQueueMock';

// TODO: Integration tests using the real queue and
// needed done callback when all items are processed
describe('ContextMenusService', () => {
    afterEach(() => {
        browserMockRemoveListeners();
        jest.clearAllMocks();
    });

    describe('init', () => {
        describe('when init is called', () => {
            it('should remove all context menus that exist', async () => {
                const contextMenu = new ContextMenusService({
                    addToQueue: makeQueueMock(),
                    browser: contextBrowserMock,
                });
                await contextMenu.init();
                const { removeAll } = contextBrowserMock.contextMenus;
                expect(removeAll).toHaveBeenCalledTimes(1);
            });

            it('should create automatic sorting checkbox menu', async () => {
                const browserMock = makeContextBrowserMock({
                    removeAll: contextMenusRemoveAllMock,
                });
                const contextMenu = new ContextMenusService({
                    addToQueue: makeQueueMock(),
                    browser: browserMock,
                });
                await contextMenu.init();
                const { create } = contextBrowserMock.contextMenus;
                const autoSortCreateProperties = {
                    checked: true,
                    contexts: ['action'],
                    id: expect.any(String),
                    title: 'Enable automatic sorting',
                    type: 'checkbox',
                    visible: true,
                };
                expect(create).toHaveBeenCalledWith(
                    autoSortCreateProperties,
                    expect.any(Function)
                );
            });

            it('should create automatic sorting checkbox menu from storage', async () => {
                const syncMock = makeSyncMock({
                    enableAutomaticSorting: false,
                });
                const browserMock = makeContextBrowserMock({
                    removeAll: contextMenusRemoveAllMock,
                    sync: syncMock,
                });
                const contextMenu = new ContextMenusService({
                    addToQueue: makeQueueMock(),
                    browser: browserMock,
                });
                await contextMenu.init();
                const { create } = browserMock.contextMenus;
                const autoSortCreateProperties = {
                    checked: false,
                    contexts: ['action'],
                    id: expect.any(String),
                    title: 'Enable automatic sorting',
                    type: 'checkbox',
                    visible: true,
                };
                expect(create).toHaveBeenCalledWith(
                    autoSortCreateProperties,
                    expect.any(Function)
                );
            });

            it('should register all relevant event handlers', async () => {
                const contextMenu = new ContextMenusService({
                    addToQueue: makeQueueMock(),
                    browser: contextBrowserMock,
                });
                await contextMenu.init();
                const { contextMenus } = browserMockListeners;
                expect(contextMenus.onClickedListeners).toHaveLength(1);
            });
        });

        describe('when enable automatic sorting toggled', () => {
            beforeEach(() => {
                const contextMenu = new ContextMenusService({
                    addToQueue: makeQueueMock(),
                    browser: contextBrowserMock,
                });
                contextMenu.init();
            });

            it('should store the setting in sync storage', () => {
                const {
                    onClickedListeners,
                } = browserMockListeners.contextMenus;
                expect(onClickedListeners).toHaveLength(1);
                const info = {
                    checked: true,
                } as MkBrowser.contextMenus.OnClickedData;
                browserMockTriggers.contextMenus.onClicked.trigger(info);
                const { sync } = contextBrowserMock.storage;
                expect(sync.set).toHaveBeenCalledTimes(1);
                const data = { enableAutomaticSorting: true };
                expect(sync.set).toHaveBeenCalledWith(
                    data,
                    expect.any(Function)
                );
            });
        });
    });
});
