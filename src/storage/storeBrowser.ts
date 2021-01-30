import { browser } from 'src/api/browser';

export const storeBrowser = {
    storage: {
        sync: browser.storage.sync,
    },
};
