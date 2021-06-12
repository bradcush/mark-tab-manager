import { Organizer as TabsOrganizer } from './tabs/Organizer';
import { Action as ActionMenu } from './menu/Action';
import { Sorter as TabsSorter } from './tabs/Sorter';
import { Grouper as TabsGrouper } from './tabs/Grouper';
import { Store } from './storage/Store';
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
    // Set the survey to be opened on uninstall
    setUninstallSurveyUrl();

    // Load settings from storage into state
    const storeInstance = new Store();
    void storeInstance.load();

    // Create tab grouper for grouping tabs
    const tabsGrouperInstance = new TabsGrouper(storeInstance);
    // Create memory cache for group caching
    const memoryCache = new MemoryCache();
    // Create tab sorter for sorting tabs
    const tabsSorterInstance = new TabsSorter(storeInstance);
    // Start tab organizer for organizing tabs
    const tabsOrganizerInstance = new TabsOrganizer({
        cache: memoryCache,
        store: storeInstance,
        tabsGrouper: tabsGrouperInstance,
        tabsSorter: tabsSorterInstance,
    });
    tabsOrganizerInstance.connect();

    // Create various context menus that dictate client behaviour
    const actionMenu = new ActionMenu({
        store: storeInstance,
        tabsGrouper: tabsGrouperInstance,
        tabsOrganizer: tabsOrganizerInstance,
    });
    // Connect for creation and handling events
    actionMenu.connect();
}

initBackground();
