import {
    browserMockListeners,
    browserMockRemoveListeners,
} from 'src/api/__mocks__/browserMockListeners';
import { browserMockTriggers } from 'src/api/__mocks__/browserMock';
import { MkBrowser } from 'src/api/MkBrowser';
import { ContextMenusService } from '../ContextMenusService';
import { contextBrowserMock } from '../__mocks__/contextMenusBrowserMock';
import { makeContextBrowserMock } from '../__mocks__/helpers/makeContextBrowserMock';
import { removeAllMock as contextMenusRemoveAllMock } from '../__mocks__/contextMenusBrowserMock/contextMenus/removeAllMock';
import { makeContextMenusStorageMock } from '../__mocks__/contextMenusStorageMock';

describe('ContextMenusService', () => {
    afterEach(() => {
        browserMockRemoveListeners();
        jest.clearAllMocks();
    });

    describe('init', () => {
        describe('when init is called', () => {
            it('should remove all context menus that exist', () => {
                const contextMenu = new ContextMenusService({
                    browser: contextBrowserMock,
                    storage: makeContextMenusStorageMock(),
                });
                contextMenu.init();
                const { removeAll } = contextBrowserMock.contextMenus;
                expect(removeAll).toHaveBeenCalledTimes(1);
            });

            it('should create automatic sorting checkbox menu', () => {
                const browserMock = makeContextBrowserMock(
                    contextMenusRemoveAllMock
                );
                const contextMenu = new ContextMenusService({
                    browser: browserMock,
                    storage: makeContextMenusStorageMock(),
                });
                contextMenu.init();
                const { create } = browserMock.contextMenus;
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

            it('should register all relevant event handlers', () => {
                const contextMenu = new ContextMenusService({
                    browser: contextBrowserMock,
                    storage: makeContextMenusStorageMock(),
                });
                contextMenu.init();
                const { contextMenus } = browserMockListeners;
                expect(contextMenus.onClickedListeners).toHaveLength(1);
            });
        });

        describe('when enable automatic sorting toggled', () => {
            it('should store the setting in sync storage', () => {
                const storageMock = makeContextMenusStorageMock();
                const contextMenu = new ContextMenusService({
                    browser: contextBrowserMock,
                    storage: storageMock,
                });
                contextMenu.init();
                const {
                    onClickedListeners,
                } = browserMockListeners.contextMenus;
                expect(onClickedListeners).toHaveLength(1);
                const info = {
                    checked: true,
                } as MkBrowser.contextMenus.OnClickedData;
                browserMockTriggers.contextMenus.onClicked.trigger(info);
                /* eslint-disable @typescript-eslint/unbound-method */
                expect(storageMock.setState).toHaveBeenCalledTimes(1);
                const data = { enableAutomaticSorting: true };
                /* eslint-disable @typescript-eslint/unbound-method */
                expect(storageMock.setState).toHaveBeenCalledWith(data);
            });
        });
    });
});
