import { MkBrowserListeners } from './MkBrowserMock';

const browserMockActionListeners = {
    onClickedListeners: [],
};

const browserMockBookmarksListeners = {
    onCreatedListeners: [],
};

const browserMockTabsListeners = {
    onActivatedListeners: [],
    onUpdatedListeners: [],
};

export const browserMockListeners: MkBrowserListeners = {
    action: browserMockActionListeners,
    bookmarks: browserMockBookmarksListeners,
    tabs: browserMockTabsListeners,
};

// Cleanup any registered listeners at once
export function browserMockRemoveListeners() {
    browserMockListeners.action.onClickedListeners = [];
    browserMockListeners.bookmarks.onCreatedListeners = [];
    browserMockListeners.tabs.onActivatedListeners = [];
    browserMockListeners.tabs.onUpdatedListeners = [];
}
