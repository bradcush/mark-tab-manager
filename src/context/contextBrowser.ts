import { browser } from 'src/api/browser';

export const contextBrowser = {
    contextMenus: {
        create: browser.contextMenus.create,
        onClicked: browser.contextMenus.onClicked,
    },
    runtime: {
        lastError: browser.runtime.lastError,
    },
    storage: {
        sync: browser.storage.sync,
    },
};
