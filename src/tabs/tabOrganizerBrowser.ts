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
    tabGroups: {
        Color: browser.tabGroups.Color,
        update: browser.tabGroups.update,
    },
    tabs: {
        group: browser.tabs.group,
        move: browser.tabs.move,
        onUpdated: browser.tabs.onUpdated,
        query: browser.tabs.query,
        ungroup: browser.tabs.ungroup,
    },
};
