import { MkBrowser } from 'src/api/MkBrowser';
import { listeners } from 'src/api/__mocks__/listeners';
import { onActivated as tabsOnActivated } from './browser/tabs/onActivated';
import { onCreated as bookmarksOnCreated } from './browser/bookmarks/onCreated';
import { onUpdated as tabsOnUpdated } from './browser/tabs/onUpdated';
import { onRemoved as tabsOnRemoved } from './browser/tabs/onRemoved';
import { onClicked as actionOnClicked } from './browser/action/onClicked';
import { onClicked as contextMenusOnClicked } from './browser/contextMenus/onClicked';
import { MkOnActivatedHandler } from './browser/tabs/MkOnActivated';
import { MkOnUpdatedHandler } from './browser/tabs/MkOnUpdated';
import { MkOnCreatedHandler } from './browser/bookmarks/MkOnCreated';
import { MkOnClickedHandler as MkActionOnClickedHandler } from './browser/action/MkOnClicked';
import { MkOnClickedHandler as MkContextMenusOnClickedHandler } from './browser/contextMenus/MkOnClicked';
import { MkOnRemovedHandler } from './browser/tabs/MkOnRemoved';

const actionTriggers = {
    onClicked: {
        trigger: actionOnClicked,
    },
};

const bookmarksTriggers = {
    onCreated: {
        trigger: bookmarksOnCreated,
    },
};

const contextMenusTriggers = {
    onClicked: {
        trigger: contextMenusOnClicked,
    },
};

const tabsTriggers = {
    onActivated: {
        trigger: tabsOnActivated,
    },
    onUpdated: {
        trigger: tabsOnUpdated,
    },
    onRemoved: {
        trigger: tabsOnRemoved,
    },
};

// Trigger events for a particular mocked listener
export const triggers = {
    action: actionTriggers,
    bookmarks: bookmarksTriggers,
    contextMenus: contextMenusTriggers,
    tabs: tabsTriggers,
};

const action = {
    onClicked: {
        addListener: (handler: MkActionOnClickedHandler) => {
            const { onClickedListeners } = listeners.action;
            onClickedListeners.push(handler);
        },
    },
    setBadgeBackgroundColor: jest.fn(),
    setBadgeText: jest.fn(),
};

const bookmarks = {
    onCreated: {
        addListener: (handler: MkOnCreatedHandler) => {
            const { onCreatedListeners } = listeners.bookmarks;
            onCreatedListeners.push(handler);
        },
    },
    search: jest.fn(),
};

const contextMenus = {
    create: jest.fn(),
    onClicked: {
        addListener: (handler: MkContextMenusOnClickedHandler) => {
            const { onClickedListeners } = listeners.contextMenus;
            onClickedListeners.push(handler);
        },
    },
};

const storage = {
    sync: {
        get: jest.fn(),
        set: jest.fn(),
    },
};

const tabs = {
    get: jest.fn(),
    onActivated: {
        addListener: (handler: MkOnActivatedHandler) => {
            const { onActivatedListeners } = listeners.tabs;
            onActivatedListeners.push(handler);
        },
    },
    onUpdated: {
        addListener: (handler: MkOnUpdatedHandler) => {
            const { onUpdatedListeners } = listeners.tabs;
            onUpdatedListeners.push(handler);
        },
    },
    onRemoved: {
        addListener: (handler: MkOnRemovedHandler) => {
            const { onRemovedListeners } = listeners.tabs;
            onRemovedListeners.push(handler);
        },
    },
    query: jest.fn(),
};

export const browser = ({
    action,
    bookmarks,
    contextMenus,
    storage,
    tabs,
} as any) as MkBrowser;
