import { browser } from 'src/api/browser';

export const uninstallBrowser = {
    runtime: {
        setUninstallURL: browser.runtime.setUninstallURL,
    },
};
