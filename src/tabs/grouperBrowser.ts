import { browser } from 'src/api/browser';

export const grouperBrowser = {
    tabGroups: {
        Color: browser.tabGroups.Color,
        query: browser.tabGroups.query,
        update: browser.tabGroups.update,
    },
    tabs: {
        group: browser.tabs.group,
        query: browser.tabs.query,
        ungroup: browser.tabs.ungroup,
    },
};
