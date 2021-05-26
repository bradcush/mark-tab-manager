import { MkListeners } from './MkBrowser';

const action = {
    onClickedListeners: [],
};

const contextMenus = {
    onClickedListeners: [],
};

const tabs = {
    onUpdatedListeners: [],
    onRemovedListeners: [],
};

export const listeners: MkListeners = {
    action,
    contextMenus,
    tabs,
};

// Cleanup any registered listeners at once
export function removeListeners(): void {
    listeners.action.onClickedListeners = [];
    listeners.contextMenus.onClickedListeners = [];
    listeners.tabs.onUpdatedListeners = [];
    listeners.tabs.onRemovedListeners = [];
}
