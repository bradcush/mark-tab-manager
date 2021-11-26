import { connect as connectTabs } from './tabs/connect';
import { connect as connectMenu } from './menu/connect';
import { create as createMenu, toggle as toggleMenu } from './menu/settings';
import { organize as organizeTabs } from './tabs/organize';
import { setStore, Store } from './storage/Store';
import { MemoryCache, setMemoryCache } from './storage/MemoryCache';
import { setUninstallUrl as setUninstallSurveyUrl } from './survey/uninstall';
import { logVerbose } from './logs/console';

/**
 * Initialize the background process
 * and all top-level listeners
 */
function initBackground() {
    // When the service worker starts
    logVerbose('Service worker started');

    // Load settings from storage into state
    const storeInstance = new Store();
    void storeInstance.load();
    // Set instance for direct use
    setStore(storeInstance);

    // Set the survey to be opened
    setUninstallSurveyUrl();

    // Set memoryCache instance for direct use
    const memoryCache = new MemoryCache();
    setMemoryCache(memoryCache);

    // Connect tab related events that
    // drive tab organization
    connectTabs(organizeTabs);

    // Create menus that drive system
    // and connect user interaction
    connectMenu({
        create: createMenu,
        toggle: toggleMenu,
    });
}

initBackground();
