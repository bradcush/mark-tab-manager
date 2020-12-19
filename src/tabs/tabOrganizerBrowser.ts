import { browser } from 'src/api/browser';

export const tabOrganizerBrowser = {
    action: {
        onClicked: browser.action.onClicked,
    },
    runtime: {
        lastError: browser.runtime.lastError,
    },
    tabs: {
        move: browser.tabs.move,
        query: browser.tabs.query,
    },
};
