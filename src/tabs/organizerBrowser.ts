import { browser } from 'src/api/browser';

export const organizerBrowser = {
    action: {
        onClicked: browser.action.onClicked,
    },
    management: {
        onEnabled: browser.management.onEnabled,
    },
    runtime: {
        id: browser.runtime.id,
        onInstalled: browser.runtime.onInstalled,
    },
    tabs: {
        onUpdated: browser.tabs.onUpdated,
        onRemoved: browser.tabs.onRemoved,
        query: browser.tabs.query,
    },
};
