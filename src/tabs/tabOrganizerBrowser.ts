import { browser } from 'src/api/browser';

export const tabOrganizerBrowser = {
    action: {
        onClicked: browser.action.onClicked,
    },
    runtime: {
        lastError: browser.runtime.lastError,
    },
    storage: {
        sync: browser.storage.sync,
    },
    tabs: {
        move: browser.tabs.move,
        onUpdated: browser.tabs.onUpdated,
        query: browser.tabs.query,
    },
};
