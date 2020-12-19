import {
    browserMockRemoveListeners,
    browserMockListeners,
} from 'src/api/__mocks__/browserMockListeners';
import { TabOrganizer } from '../TabOrganizer';
import { organizerBrowserMock } from '../__mocks__/organizerBrowserMock';
import { browserMockTriggers } from 'src/api/__mocks__/browserMock';
import { MkBrowser } from 'src/api/MkBrowser';
import { makeQueryMock } from 'src/api/__mocks__/browserMock/tabs/queryMock';

describe('TabOrganizer', () => {
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
                const { action } = browserMockListeners;
                expect(action.onClickedListeners).toHaveLength(1);
            });
        });

        // TODO: Make these tests a bit more exhaustive so we
        // have an idea how the more nominal cases are treated
        describe('when the extension icon is clicked', () => {
            beforeEach(() => {
                const tabs = [
                    {
                        id: 4,
                        url: 'https://sub.sub.dragonfruit.com',
                    },
                    {
                        id: 2,
                        url: 'https://www.banana.com',
                    },
                    {
                        id: 1,
                        url: 'https://apple.com',
                    },
                    {
                        id: 3,
                        url: 'https://sub.cherry.com',
                    },
                    {
                        id: 6,
                        url: 'https://fig.be',
                    },
                    {
                        id: 5,
                        url: 'https://elderberry.co.uk',
                    },
                ] as MkBrowser.tabs.Tab[];
                const browserMock = {
                    ...organizerBrowserMock,
                    tabs: {
                        ...organizerBrowserMock.tabs,
                        query: makeQueryMock(tabs),
                    },
                };
                const tabOrganizer = new TabOrganizer(browserMock);
                tabOrganizer.init();
            });

            it('should reorder all open tabs alphabetically by second-level domain', () => {
                const { onClickedListeners } = browserMockListeners.action;
                expect(onClickedListeners).toHaveLength(1);
                browserMockTriggers.action.onClicked.trigger();
                const { move } = organizerBrowserMock.tabs;
                expect(move).toBeCalledTimes(6);
                const moveProperties = { index: -1 };
                const expectedIdsOrder = [1, 2, 3, 4, 5, 6];
                expectedIdsOrder.forEach((id, index) => {
                    const tabId = index + 1;
                    expect(move).toHaveBeenNthCalledWith(
                        tabId,
                        id,
                        moveProperties,
                        expect.any(Function)
                    );
                });
            });
        });
    });
});
