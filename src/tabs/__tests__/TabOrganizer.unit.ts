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

describe('TabOrganizer', () => {
    const tabs = makeTabsMock();

    afterEach(() => {
        browserMockRemoveListeners();
        jest.clearAllMocks();
    });

    describe('init', () => {
        describe('when init is called', () => {
            beforeEach(() => {
                const tabOrganizer = new TabOrganizer(organizerBrowserMock);
                tabOrganizer.init();
            });

            it('should register all relevant event handlers', () => {
                const { action, tabs } = browserMockListeners;
                expect(action.onClickedListeners).toHaveLength(1);
                expect(tabs.onUpdatedListeners).toHaveLength(1);
            });

            it('should reorder all open tabs if automatic sorting is enabled', async () => {
                const items = { enableAutomaticSorting: true };
                const browserMock = makeOrganizerBrowserMock({
                    items,
                    tabs,
                    group: jest.fn(),
                });
                const tabOrganizer = new TabOrganizer(browserMock);
                await tabOrganizer.init();
                const { move } = browserMock.tabs;
                expect(move).toBeCalledTimes(9);
                const moveProperties = { index: -1 };
                const expectedIdsOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
            it('should reorder all open tabs', async () => {
                const items = {};
                const browserMock = makeOrganizerBrowserMock({
                    items,
                    tabs,
                    group: jest.fn(),
                });
                const tabOrganizer = new TabOrganizer(browserMock);
                await tabOrganizer.init();
                const { onClickedListeners } = browserMockListeners.action;
                expect(onClickedListeners).toHaveLength(1);
                browserMockTriggers.action.onClicked.trigger();
                const { move } = browserMock.tabs;
                expect(move).toBeCalledTimes(9);
                const moveProperties = { index: -1 };
                const expectedIdsOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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

            it('should ungroup open tabs not part of any group', async () => {
                const { onClickedListeners } = browserMockListeners.action;
                const items = {};
                const browserMock = makeOrganizerBrowserMock({
                    items,
                    tabs,
                    group: jest.fn(),
                });
                const tabOrganizer = new TabOrganizer(browserMock);
                await tabOrganizer.init();
                expect(onClickedListeners).toHaveLength(1);
                browserMockTriggers.action.onClicked.trigger();
                const { ungroup } = browserMock.tabs;
                expect(ungroup).toHaveBeenCalledTimes(5);
                const expectedIdsOrder = [[3], [4], [7], [8], [9]];
                expectedIdsOrder.forEach((ids, index) => {
                    const count = index + 1;
                    expect(ungroup).toHaveBeenNthCalledWith(
                        count,
                        ids,
                        expect.any(Function)
                    );
                });
            });

            it('should group open tabs that are part of a group', async () => {
                const { onClickedListeners } = browserMockListeners.action;
                const items = {};
                const browserMock = makeOrganizerBrowserMock({
                    items,
                    tabs,
                    group: jest.fn(),
                });
                const tabOrganizer = new TabOrganizer(browserMock);
                await tabOrganizer.init();
                expect(onClickedListeners).toHaveLength(1);
                browserMockTriggers.action.onClicked.trigger();
                const { group } = browserMock.tabs;
                expect(group).toHaveBeenCalledTimes(2);
                const expectedIdsOrder = [
                    { tabIds: [1, 2] },
                    { tabIds: [5, 6] },
                ];
                expectedIdsOrder.forEach((ids, index) => {
                    const count = index + 1;
                    expect(group).toHaveBeenNthCalledWith(
                        count,
                        ids,
                        expect.any(Function)
                    );
                });
            });

            it('should color and name groups by domain and group count', async () => {
                const items = {};
                const browserMock = makeOrganizerBrowserMock({
                    items,
                    tabs,
                    group: groupMock,
                });
                const tabOrganizer = new TabOrganizer(browserMock);
                await tabOrganizer.init();
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
            it('should reorder all open tabs if automatic sorting is enabled', async () => {
                const items = { enableAutomaticSorting: true };
                const browserMock = makeOrganizerBrowserMock({
                    items,
                    tabs,
                    group: jest.fn(),
                });
                const tabOrganizer = new TabOrganizer(browserMock);
                await tabOrganizer.init();
                const { move } = browserMock.tabs;
                expect(move).toBeCalledTimes(9);
                const { onUpdatedListeners } = browserMockListeners.tabs;
                expect(onUpdatedListeners).toHaveLength(1);
                await browserMockTriggers.tabs.onUpdated.trigger();
                expect(move).toBeCalledTimes(18);
                const moveProperties = { index: -1 };
                const expectedIdsOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
            });

            it('should not reorder anything if automatic sorting is disabled', async () => {
                const items = { enableAutomaticSorting: false };
                const browserMock = makeOrganizerBrowserMock({
                    items,
                    tabs,
                    group: jest.fn(),
                });
                const tabOrganizer = new TabOrganizer(browserMock);
                await tabOrganizer.init();
                const { onUpdatedListeners } = browserMockListeners.tabs;
                expect(onUpdatedListeners).toHaveLength(1);
                await browserMockTriggers.tabs.onUpdated.trigger();
                const { move } = browserMock.tabs;
                expect(move).toHaveBeenCalledTimes(0);
            });
        });
    });
});
