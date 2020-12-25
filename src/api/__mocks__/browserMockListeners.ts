import { MkBrowserListeners } from './MkBrowserMock';

const browserMockActionListeners = {
    onClickedListeners: [],
};

const browserMockBookmarksListeners = {
    onCreatedListeners: [],
};

const browserMockContextMenusListeners = {
    onClickedListeners: [],
};

const browserMockTabsListeners = {
    onActivatedListeners: [],
    onUpdatedListeners: [],
};

export const browserMockListeners: MkBrowserListeners = {
    action: browserMockActionListeners,
    bookmarks: browserMockBookmarksListeners,
    contextMenus: browserMockContextMenusListeners,
    tabs: browserMockTabsListeners,
};

// Cleanup any registered listeners at once
export function browserMockRemoveListeners() {
    browserMockListeners.action.onClickedListeners = [];
    browserMockListeners.bookmarks.onCreatedListeners = [];
    browserMockListeners.contextMenus.onClickedListeners = [];
    browserMockListeners.tabs.onActivatedListeners = [];
    browserMockListeners.tabs.onUpdatedListeners = [];
}
