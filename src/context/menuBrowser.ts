import { browser } from 'src/api/browser';

export const menuBrowser = {
    contextMenus: {
        create: browser.contextMenus.create,
        onClicked: browser.contextMenus.onClicked,
        removeAll: browser.contextMenus.removeAll,
    },
    runtime: {
        onInstalled: browser.runtime.onInstalled,
    },
};
