import {
    browserMockRemoveListeners,
    browserMockListeners,
} from 'src/api/__mocks__/browserMockListeners';
import { TabOrganizer } from '../TabOrganizer';
import { organizerBrowserMock } from '../__mocks__/organizerBrowserMock';
import { browserMockTriggers } from 'src/api/__mocks__/browserMock';
import { makeOrganizerBrowserMock } from '../__mocks__/helpers/makeOrganizerBrowserMock';
import { makeTabsMock } from '../__mocks__/helpers/makeTabsMock';
import { groupMock } from '../__mocks__/organizerBrowserMock/tabs/groupMock';
import { makeOrganizerStorageMock } from '../__mocks__/organizerStorageMock';

describe('TabOrganizer', () => {
    const tabs = makeTabsMock();

    afterEach(() => {
        browserMockRemoveListeners();
        jest.clearAllMocks();
    });

    describe('when the service is initialized', () => {
        it('should register all relevant event handlers', () => {
            const tabOrganizer = new TabOrganizer({
                browser: organizerBrowserMock,
                storage: makeOrganizerStorageMock(),
            });
            tabOrganizer.init();
            const { action, tabs } = browserMockListeners;
            expect(action.onClickedListeners).toHaveLength(1);
            expect(tabs.onUpdatedListeners).toHaveLength(1);
        });

        it('should reorder all open tabs if automatic sorting is enabled', () => {
            const browserMock = makeOrganizerBrowserMock({
                tabs,
                group: jest.fn(),
            });
            const tabOrganizer = new TabOrganizer({
                browser: browserMock,
                storage: makeOrganizerStorageMock(),
            });
            tabOrganizer.init();
            const { move } = browserMock.tabs;
            expect(move).toBeCalledTimes(10);
            const moveProperties = { index: -1 };
            const expectedIdsOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            expectedIdsOrder.forEach((id, index) => {
                const count = index + 1;
                expect(move).toHaveBeenNthCalledWith(
                    count,
                    id,
                    moveProperties,
                    expect.any(Function)
                );
            });
        });
    });

    // TODO: Make these tests a bit more exhaustive so we
    // have an idea how the more nominal cases are treated
    describe('when the extension icon is clicked', () => {
        it('should reorder all open tabs', () => {
            const browserMock = makeOrganizerBrowserMock({
                tabs,
                group: jest.fn(),
            });
            const state = { enableAutomaticSorting: false };
            const tabOrganizer = new TabOrganizer({
                browser: browserMock,
                storage: makeOrganizerStorageMock(state),
            });
            tabOrganizer.init();
            const { onClickedListeners } = browserMockListeners.action;
            expect(onClickedListeners).toHaveLength(1);
            browserMockTriggers.action.onClicked.trigger();
            const { move } = browserMock.tabs;
            expect(move).toBeCalledTimes(10);
            const moveProperties = { index: -1 };
            const expectedIdsOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            expectedIdsOrder.forEach((id, index) => {
                const count = index + 1;
                expect(move).toHaveBeenNthCalledWith(
                    count,
                    id,
                    moveProperties,
                    expect.any(Function)
                );
            });
        });

        it('should ungroup open tabs not part of any group', () => {
            const { onClickedListeners } = browserMockListeners.action;
            const browserMock = makeOrganizerBrowserMock({
                tabs,
                group: jest.fn(),
            });
            const state = { enableAutomaticSorting: false };
            const tabOrganizer = new TabOrganizer({
                browser: browserMock,
                storage: makeOrganizerStorageMock(state),
            });
            tabOrganizer.init();
            expect(onClickedListeners).toHaveLength(1);
            browserMockTriggers.action.onClicked.trigger();
            const { ungroup } = browserMock.tabs;
            expect(ungroup).toHaveBeenCalledTimes(6);
            const expectedIdsOrder = [[3], [4], [7], [8], [9], [10]];
            expectedIdsOrder.forEach((ids, index) => {
                const count = index + 1;
                expect(ungroup).toHaveBeenNthCalledWith(
                    count,
                    ids,
                    expect.any(Function)
                );
            });
        });

        it('should group open tabs that are part of a group', () => {
            const { onClickedListeners } = browserMockListeners.action;
            const browserMock = makeOrganizerBrowserMock({
                tabs,
                group: jest.fn(),
            });
            const state = { enableAutomaticSorting: false };
            const tabOrganizer = new TabOrganizer({
                browser: browserMock,
                storage: makeOrganizerStorageMock(state),
            });
            tabOrganizer.init();
            expect(onClickedListeners).toHaveLength(1);
            browserMockTriggers.action.onClicked.trigger();
            const { group } = browserMock.tabs;
            expect(group).toHaveBeenCalledTimes(2);
            const expectedIdsOrder = [{ tabIds: [1, 2] }, { tabIds: [5, 6] }];
            expectedIdsOrder.forEach((ids, index) => {
                const count = index + 1;
                expect(group).toHaveBeenNthCalledWith(
                    count,
                    ids,
                    expect.any(Function)
                );
            });
        });

        it('should color and name groups by domain and group count', () => {
            const browserMock = makeOrganizerBrowserMock({
                tabs,
                group: groupMock,
            });
            const state = { enableAutomaticSorting: false };
            const tabOrganizer = new TabOrganizer({
                browser: browserMock,
                storage: makeOrganizerStorageMock(state),
            });
            tabOrganizer.init();
            const { onClickedListeners } = browserMockListeners.action;
            expect(onClickedListeners).toHaveLength(1);
            browserMockTriggers.action.onClicked.trigger();
            const { update } = browserMock.tabGroups;
            expect(update).toHaveBeenCalledTimes(2);
            const expectedArgsOrder = [
                {
                    color: 'blue',
                    id: 123,
                    title: 'system (2)',
                },
                {
                    color: 'cyan',
                    id: 456,
                    title: 'cherry (2)',
                },
            ];
            expectedArgsOrder.forEach((arg, index) => {
                const count = index + 1;
                const updateProperties = {
                    color: arg.color,
                    title: arg.title,
                };
                expect(update).toHaveBeenNthCalledWith(
                    count,
                    expect.any(Number),
                    updateProperties,
                    expect.any(Function)
                );
            });
        });
    });

    describe('when a tabs URL is updated', () => {
        it('should reorder all open tabs if automatic sorting is enabled', () => {
            const browserMock = makeOrganizerBrowserMock({
                tabs,
                group: jest.fn(),
            });
            const tabOrganizer = new TabOrganizer({
                browser: browserMock,
                storage: makeOrganizerStorageMock(),
            });
            tabOrganizer.init();
            const { move } = browserMock.tabs;
            expect(move).toBeCalledTimes(10);
            const { onUpdatedListeners } = browserMockListeners.tabs;
            expect(onUpdatedListeners).toHaveLength(1);
            browserMockTriggers.tabs.onUpdated.trigger();
            // Must match the timeout specified in TabOrganizer
            const DEBOUNCE_TIMEOUT = 50;
            setTimeout(() => {
                expect(move).toBeCalledTimes(20);
                const moveProperties = { index: -1 };
                const expectedIdsOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                [...expectedIdsOrder, ...expectedIdsOrder].forEach(
                    (id, index) => {
                        const count = index + 1;
                        expect(move).toHaveBeenNthCalledWith(
                            count,
                            id,
                            moveProperties,
                            expect.any(Function)
                        );
                    }
                );
            }, DEBOUNCE_TIMEOUT);
        });

        it('should not reorder anything if automatic sorting is disabled', () => {
            const browserMock = makeOrganizerBrowserMock({
                tabs,
                group: jest.fn(),
            });
            const state = { enableAutomaticSorting: false };
            const tabOrganizer = new TabOrganizer({
                browser: browserMock,
                storage: makeOrganizerStorageMock(state),
            });
            tabOrganizer.init();
            const { onUpdatedListeners } = browserMockListeners.tabs;
            expect(onUpdatedListeners).toHaveLength(1);
            browserMockTriggers.tabs.onUpdated.trigger();
            const { move } = browserMock.tabs;
            expect(move).toHaveBeenCalledTimes(0);
        });
    });

    describe('when a tab is removed', () => {
        it('should reorder all open tabs if automatic sorting is enabled', () => {
            const browserMock = makeOrganizerBrowserMock({
                tabs,
                group: jest.fn(),
            });
            const tabOrganizer = new TabOrganizer({
                browser: browserMock,
                storage: makeOrganizerStorageMock(),
            });
            tabOrganizer.init();
            const { move } = browserMock.tabs;
            expect(move).toBeCalledTimes(10);
            const { onRemovedListeners } = browserMockListeners.tabs;
            expect(onRemovedListeners).toHaveLength(1);
            browserMockTriggers.tabs.onRemoved.trigger();
            // Must match the timeout specified in TabOrganizer
            const DEBOUNCE_TIMEOUT = 50;
            setTimeout(() => {
                expect(move).toBeCalledTimes(20);
                const moveProperties = { index: -1 };
                const expectedIdsOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                [...expectedIdsOrder, ...expectedIdsOrder].forEach(
                    (id, index) => {
                        const count = index + 1;
                        expect(move).toHaveBeenNthCalledWith(
                            count,
                            id,
                            moveProperties,
                            expect.any(Function)
                        );
                    }
                );
            }, DEBOUNCE_TIMEOUT);
        });

        it('should not reorder anything if automatic sorting is disabled', () => {
            const browserMock = makeOrganizerBrowserMock({
                tabs,
                group: jest.fn(),
            });
            const state = { enableAutomaticSorting: false };
            const tabOrganizer = new TabOrganizer({
                browser: browserMock,
                storage: makeOrganizerStorageMock(state),
            });
            tabOrganizer.init();
            const { onRemovedListeners } = browserMockListeners.tabs;
            expect(onRemovedListeners).toHaveLength(1);
            browserMockTriggers.tabs.onRemoved.trigger();
            const { move } = browserMock.tabs;
            expect(move).toHaveBeenCalledTimes(0);
        });
    });
});
