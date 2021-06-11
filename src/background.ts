import { Organizer as TabsOrganizer } from './tabs/Organizer';
import { Action as ActionMenu } from './menu/Action';
import { Sorter as TabsSorter } from './tabs/Sorter';
import { Grouper as TabsGrouper } from './tabs/Grouper';
import { Store } from './storage/Store';
import { ConsoleLogger } from './logs/ConsoleLogger';
import { MemoryCache } from './storage/MemoryCache';
import { setUninstallUrl as setUninstallSurveyUrl } from './survey/uninstall';

// When the service worker starts
const logger = new ConsoleLogger();
logger.log('Service worker started');

/**
 * Initialize the background process
 * and all top-level listeners
 */
function initBackground() {
    // Set the survey to be opened on uninstall
    setUninstallSurveyUrl();

    // Load settings from storage into state
    const storeInstance = new Store(ConsoleLogger);
    void storeInstance.load();

    // Create tab grouper for grouping tabs
    const tabsGrouperInstance = new TabsGrouper({
        store: storeInstance,
        Logger: ConsoleLogger,
    });
    // Create memory cache for group caching
    const memoryCache = new MemoryCache(ConsoleLogger);
    // Create tab sorter for sorting tabs
    const tabsSorterInstance = new TabsSorter({
        store: storeInstance,
        Logger: ConsoleLogger,
    });
    // Start tab organizer for organizing tabs
    const tabsOrganizerInstance = new TabsOrganizer({
        cache: memoryCache,
        store: storeInstance,
        tabsGrouper: tabsGrouperInstance,
        tabsSorter: tabsSorterInstance,
        Logger: ConsoleLogger,
    });
    tabsOrganizerInstance.connect();

    // Create various context menus that dictate client behaviour
    const actionMenu = new ActionMenu({
        store: storeInstance,
        tabsGrouper: tabsGrouperInstance,
        tabsOrganizer: tabsOrganizerInstance,
        Logger: ConsoleLogger,
    });
    // Connect for creation and handling events
    actionMenu.connect();
}

initBackground();
