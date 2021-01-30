import { MkListeners } from './MkBrowser';

const action = {
    onClickedListeners: [],
};

const bookmarks = {
    onCreatedListeners: [],
};

const contextMenus = {
    onClickedListeners: [],
};

const tabs = {
    onActivatedListeners: [],
    onUpdatedListeners: [],
    onRemovedListeners: [],
};

export const listeners: MkListeners = {
    action,
    bookmarks,
    contextMenus,
    tabs,
};

// Cleanup any registered listeners at once
export function removeListeners(): void {
    listeners.action.onClickedListeners = [];
    listeners.bookmarks.onCreatedListeners = [];
    listeners.contextMenus.onClickedListeners = [];
    listeners.tabs.onActivatedListeners = [];
    listeners.tabs.onUpdatedListeners = [];
    listeners.tabs.onRemovedListeners = [];
}
