import { MkBrowser } from 'src/api/MkBrowser';
import { browserMockListeners } from 'src/api/__mocks__/browserMockListeners';
import { onActivatedMock as tabsOnActivatedMock } from './browserMock/tabs/onActivatedMock';
import { onCreatedMock as bookmarksOnCreatedMock } from './browserMock/bookmarks/onCreatedMock';
import { onUpdatedMock as tabsOnUpdatedMock } from './browserMock/tabs/onUpdatedMock';
import { onClickedMock as actionOnClickedMock } from './browserMock/action/onClickedMock';
import { MkTabsOnActivatedMockHandler } from './browserMock/tabs/MkOnActivatedMock';
import { MkTabsOnUpdatedMockHandler } from './browserMock/tabs/MkOnUpdatedMock';
import { MkBookmarksOnCreatedMockHandler } from './browserMock/bookmarks/MkOnCreatedMock';
import { MkActionOnClickedMockHandler } from './browserMock/action/MkOnClickedMock';

const browserMockActionTriggers = {
    onClicked: {
        trigger: actionOnClickedMock,
    },
};

const browserMockBookmarksTriggers = {
    onCreated: {
        trigger: bookmarksOnCreatedMock,
    },
};

const browserMockTabsTriggers = {
    onActivated: {
        trigger: tabsOnActivatedMock,
    },
    onUpdated: {
        trigger: tabsOnUpdatedMock,
    },
};

// Trigger events for a particular mocked listener
export const browserMockTriggers = {
    action: browserMockActionTriggers,
    bookmarks: browserMockBookmarksTriggers,
    tabs: browserMockTabsTriggers,
};

const browserActionMock = {
    onClicked: {
        addListener: (handler: MkActionOnClickedMockHandler) => {
            const { onClickedListeners } = browserMockListeners.action;
            onClickedListeners.push(handler);
        },
    },
    setBadgeBackgroundColor: jest.fn(),
    setBadgeText: jest.fn(),
};

const browserBookmarksMock = {
    onCreated: {
        addListener: (handler: MkBookmarksOnCreatedMockHandler) => {
            const { onCreatedListeners } = browserMockListeners.bookmarks;
            onCreatedListeners.push(handler);
        },
    },
    search: jest.fn(),
};

const browserRuntimeMock = {
    lastError: undefined,
};

const browserTabsMock = {
    get: jest.fn(),
    onActivated: {
        addListener: (handler: MkTabsOnActivatedMockHandler) => {
            const { onActivatedListeners } = browserMockListeners.tabs;
            onActivatedListeners.push(handler);
        },
    },
    onUpdated: {
        addListener: (handler: MkTabsOnUpdatedMockHandler) => {
            const { onUpdatedListeners } = browserMockListeners.tabs;
            onUpdatedListeners.push(handler);
        },
    },
    query: jest.fn(),
};

export const browserMock = ({
    action: browserActionMock,
    bookmarks: browserBookmarksMock,
    runtime: browserRuntimeMock,
    tabs: browserTabsMock,
} as any) as MkBrowser;
