import { MkBrowser } from 'src/api/MkBrowser';
import { listeners } from 'src/api/mocks/listeners';
import { onUpdated as tabsOnUpdated } from './browser/tabs/onUpdated';
import { onRemoved as tabsOnRemoved } from './browser/tabs/onRemoved';
import { onClicked as actionOnClicked } from './browser/action/onClicked';
import { onClicked as contextMenusOnClicked } from './browser/contextMenus/onClicked';
import { MkOnUpdatedHandler } from './browser/tabs/MkOnUpdated';
import { MkOnClickedHandler as MkActionOnClickedHandler } from './browser/action/MkOnClicked';
import { MkOnClickedHandler as MkContextMenusOnClickedHandler } from './browser/contextMenus/MkOnClicked';
import { MkOnRemovedHandler } from './browser/tabs/MkOnRemoved';

const actionTriggers = {
    onClicked: {
        trigger: actionOnClicked,
    },
};

const contextMenusTriggers = {
    onClicked: {
        trigger: contextMenusOnClicked,
    },
};

const tabsTriggers = {
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
};

const contextMenus = {
    onClicked: {
        addListener: (handler: MkContextMenusOnClickedHandler) => {
            const { onClickedListeners } = listeners.contextMenus;
            onClickedListeners.push(handler);
        },
    },
};

const tabs = {
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
};

export const browser = ({
    action,
    contextMenus,
    tabs,
    // Mocking requires any assertion
    // eslint-disable-next-line
} as any) as MkBrowser;
