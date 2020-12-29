import { browser } from 'src/api/browser';

export const contextBrowser = {
    contextMenus: {
        create: browser.contextMenus.create,
        onClicked: browser.contextMenus.onClicked,
        removeAll: browser.contextMenus.removeAll,
    },
    runtime: {
        lastError: browser.runtime.lastError,
    },
    storage: {
        sync: browser.storage.sync,
    },
};
