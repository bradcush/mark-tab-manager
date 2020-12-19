import {
    browserMockListeners,
    browserMockRemoveListeners,
} from 'src/api/__mocks__/browserMockListeners';
import { BookmarkCounter } from '../BookmarkCounter';
import { counterBrowserMock } from '../__mocks__/counterBrowserMock';
import { browserMockTriggers } from 'src/api/__mocks__/browserMock';
import { MkBrowser } from 'src/api/MkBrowser';
import { testUpdateBadge } from './helpers/testUpdateBadge';
import { makeSearchMock } from '../__mocks__/counterBrowserMock/bookmarks/searchMock';
import { makeCounterBrowserMock } from './helpers/makeCounterBrowserMock';

describe('BookmarkCounter', () => {
    afterEach(() => {
        browserMockRemoveListeners();
        jest.clearAllMocks();
    });

    describe('init', () => {
        describe('when init is called', () => {
            beforeEach(() => {
                const searchMock = makeSearchMock([]);
                const browserMock = makeCounterBrowserMock(searchMock);
                const bookmarkCounter = new BookmarkCounter(browserMock);
                bookmarkCounter.init();
            });

            it('should register all relevant event handlers', () => {
                const { bookmarks, tabs } = browserMockListeners;
                expect(tabs.onActivatedListeners).toHaveLength(1);
                expect(tabs.onUpdatedListeners).toHaveLength(1);
                expect(bookmarks.onCreatedListeners).toHaveLength(1);
            });

            it('should reset the bookmark count for the current tab', () => {
                testUpdateBadge({
                    color: '#F00',
                    text: '0',
                    timesCalled: 1,
                });
            });
        });

        describe('when an existing tab is focused', () => {
            it('should set the current tab bookmark count in red', () => {
                const searchMock = makeSearchMock([]);
                const browserMock = makeCounterBrowserMock(searchMock);
                const bookmarkCounter = new BookmarkCounter(browserMock);
                bookmarkCounter.init();
                const {
                    setBadgeBackgroundColor,
                    setBadgeText,
                } = counterBrowserMock.action;
                expect(setBadgeBackgroundColor).toHaveBeenCalledTimes(1);
                expect(setBadgeText).toHaveBeenCalledTimes(1);
                const { tabs } = browserMockListeners;
                expect(tabs.onActivatedListeners).toHaveLength(1);
                browserMockTriggers.tabs.onActivated.trigger(1);
                testUpdateBadge({
                    color: '#F00',
                    text: '0',
                    timesCalled: 2,
                });
            });

            it('should set the current tab bookmark count in blue', () => {
                const result = {
                    id: '123',
                } as MkBrowser.bookmarks.BookmarkTreeNode;
                const searchMock = makeSearchMock([result]);
                const browserMock = makeCounterBrowserMock(searchMock);
                const bookmarkCounter = new BookmarkCounter(browserMock);
                bookmarkCounter.init();
                const {
                    setBadgeBackgroundColor,
                    setBadgeText,
                } = counterBrowserMock.action;
                expect(setBadgeBackgroundColor).toHaveBeenCalledTimes(1);
                expect(setBadgeText).toHaveBeenCalledTimes(1);
                const { tabs } = browserMockListeners;
                expect(tabs.onActivatedListeners).toHaveLength(1);
                browserMockTriggers.tabs.onActivated.trigger(1);
                testUpdateBadge({
                    color: '#00F',
                    text: '1',
                    timesCalled: 2,
                });
            });
        });

        // TODO: We should abstract away UI changes into another class
        // and move some of these details that are redundantly tested
        describe('when the URL of an already focused tab is updated', () => {
            it('should set the current tab bookmark count in red', () => {
                const searchMock = makeSearchMock([]);
                const browserMock = makeCounterBrowserMock(searchMock);
                const bookmarkCounter = new BookmarkCounter(browserMock);
                bookmarkCounter.init();
                const {
                    setBadgeBackgroundColor,
                    setBadgeText,
                } = counterBrowserMock.action;
                expect(setBadgeBackgroundColor).toHaveBeenCalledTimes(1);
                expect(setBadgeText).toHaveBeenCalledTimes(1);
                const { tabs } = browserMockListeners;
                expect(tabs.onUpdatedListeners).toHaveLength(1);
                browserMockTriggers.tabs.onUpdated.trigger();
                testUpdateBadge({
                    color: '#F00',
                    text: '0',
                    timesCalled: 2,
                });
            });

            it('should set the current tab bookmark count in blue', () => {
                const result = {
                    id: '123',
                } as MkBrowser.bookmarks.BookmarkTreeNode;
                const searchMock = makeSearchMock([result]);
                const browserMock = makeCounterBrowserMock(searchMock);
                const bookmarkCounter = new BookmarkCounter(browserMock);
                bookmarkCounter.init();
                const {
                    setBadgeBackgroundColor,
                    setBadgeText,
                } = counterBrowserMock.action;
                expect(setBadgeBackgroundColor).toHaveBeenCalledTimes(1);
                expect(setBadgeText).toHaveBeenCalledTimes(1);
                const { tabs } = browserMockListeners;
                expect(tabs.onUpdatedListeners).toHaveLength(1);
                browserMockTriggers.tabs.onUpdated.trigger();
                testUpdateBadge({
                    color: '#00F',
                    text: '1',
                    timesCalled: 2,
                });
            });
        });

        describe('when a new bookmark is created', () => {
            it('should set the current tab bookmark count in red', () => {
                const searchMock = makeSearchMock([]);
                const browserMock = makeCounterBrowserMock(searchMock);
                const bookmarkCounter = new BookmarkCounter(browserMock);
                bookmarkCounter.init();
                const {
                    setBadgeBackgroundColor,
                    setBadgeText,
                } = counterBrowserMock.action;
                expect(setBadgeBackgroundColor).toHaveBeenCalledTimes(1);
                expect(setBadgeText).toHaveBeenCalledTimes(1);
                const { bookmarks } = browserMockListeners;
                expect(bookmarks.onCreatedListeners).toHaveLength(1);
                browserMockTriggers.bookmarks.onCreated.trigger();
                testUpdateBadge({
                    color: '#F00',
                    text: '0',
                    timesCalled: 2,
                });
            });

            it('should set the current tab bookmark count in blue', () => {
                const result = {
                    id: '123',
                } as MkBrowser.bookmarks.BookmarkTreeNode;
                const searchMock = makeSearchMock([result]);
                const browserMock = makeCounterBrowserMock(searchMock);
                const bookmarkCounter = new BookmarkCounter(browserMock);
                bookmarkCounter.init();
                const {
                    setBadgeBackgroundColor,
                    setBadgeText,
                } = counterBrowserMock.action;
                expect(setBadgeBackgroundColor).toHaveBeenCalledTimes(1);
                expect(setBadgeText).toHaveBeenCalledTimes(1);
                const { bookmarks } = browserMockListeners;
                expect(bookmarks.onCreatedListeners).toHaveLength(1);
                browserMockTriggers.bookmarks.onCreated.trigger();
                testUpdateBadge({
                    color: '#00F',
                    text: '1',
                    timesCalled: 2,
                });
            });
        });
    });
});
