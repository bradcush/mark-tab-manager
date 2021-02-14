import { browser } from 'src/api/browser';

export const organizerBrowser = {
    action: {
        onClicked: browser.action.onClicked,
    },
    runtime: {
        lastError: browser.runtime.lastError,
    },
    storage: {
        sync: browser.storage.sync,
    },
    tabGroups: {
        Color: browser.tabGroups.Color,
        query: browser.tabGroups.query,
        update: browser.tabGroups.update,
    },
    tabs: {
        group: browser.tabs.group,
        move: browser.tabs.move,
        onUpdated: browser.tabs.onUpdated,
        onRemoved: browser.tabs.onRemoved,
        query: browser.tabs.query,
        ungroup: browser.tabs.ungroup,
    },
};
