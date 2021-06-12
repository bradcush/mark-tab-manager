import { Organizer as TabsOrganizer } from './tabs/Organizer';
import { Action as ActionMenu } from './menu/Action';
import { Sorter as TabsSorter } from './tabs/Sorter';
import { Grouper as TabsGrouper } from './tabs/Grouper';
import { setStore, Store } from './storage/Store';
import { MemoryCache } from './storage/MemoryCache';
import { setUninstallUrl as setUninstallSurveyUrl } from './survey/uninstall';
import { logVerbose } from './logs/console';

// When the service worker starts
logVerbose('Service worker started');

/**
 * Initialize the background process
 * and all top-level listeners
 */
function initBackground() {
    // Load settings from storage into state
    const storeInstance = new Store();
    void storeInstance.load();
    // Set instance for direct use
    setStore(storeInstance);

    // Set the survey to be opened
    setUninstallSurveyUrl();

    // Prepare deps needed for organization
    const tabsGrouperInstance = new TabsGrouper();
    const memoryCache = new MemoryCache();
    const tabsSorterInstance = new TabsSorter();

    // Start tab organizer for organizing tabs
    const tabsOrganizerInstance = new TabsOrganizer({
        cache: memoryCache,
        tabsGrouper: tabsGrouperInstance,
        tabsSorter: tabsSorterInstance,
    });
    tabsOrganizerInstance.connect();

    // Create menus that control client behaviour
    const actionMenu = new ActionMenu({
        tabsGrouper: tabsGrouperInstance,
        tabsOrganizer: tabsOrganizerInstance,
    });
    actionMenu.connect();
}

initBackground();
