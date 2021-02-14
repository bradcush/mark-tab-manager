import { browser } from 'src/api/browser';

export const menuBrowser = {
    contextMenus: {
        create: browser.contextMenus.create,
        onClicked: browser.contextMenus.onClicked,
        removeAll: browser.contextMenus.removeAll,
    },
    runtime: {
        lastError: browser.runtime.lastError,
        onInstalled: browser.runtime.onInstalled,
    },
};
