import { Organizer as TabsOrganizer } from './tabs/Organizer';
import { organizerBrowser as tabsOrganizerBrowser } from './tabs/organizerBrowser';
import { Menu as ContextMenu } from './context/Menu';
import { menuBrowser as contextMenuBrowser } from './context/menuBrowser';
import { Sorter as TabsSorter } from './tabs/Sorter';
import { sorterBrowser as tabsSorterBrowser } from './tabs/sorterBrowser';
import { Grouper as TabsGrouper } from './tabs/Grouper';
import { grouperBrowser as tabsGrouperBrowser } from './tabs/grouperBrowser';
import { Store } from './storage/Store';
import { storeBrowser } from './storage/storeBrowser';
import { ConsoleLogger } from './logs/ConsoleLogger';
import { MemoryCache } from './storage/MemoryCache';
import { setUninstallUrl as setUninstallSurveyUrl } from './survey/uninstall';
import { uninstallBrowser as uninstallSurveyBrowser } from './survey/uninstallBrowser';

// When the service worker starts
const logger = new ConsoleLogger();
logger.log('Service worker started');

/**
 * Initialize the background process
 * and all top-level listeners
 */
function initBackground() {
    // Set the survey to be opened on uninstall
    setUninstallSurveyUrl(uninstallSurveyBrowser);

    // Load settings from storage into state
    const storeInstance = new Store({
        browser: storeBrowser,
        Logger: ConsoleLogger,
    });
    void storeInstance.load();

    // Create tab grouper for grouping tabs
    const tabsGrouperInstance = new TabsGrouper({
        browser: tabsGrouperBrowser,
        store: storeInstance,
        Logger: ConsoleLogger,
    });
    // Create memory cache for group caching
    const memoryCache = new MemoryCache(ConsoleLogger);
    // Create tab sorter for sorting tabs
    const tabsSorterInstance = new TabsSorter({
        browser: tabsSorterBrowser,
        store: storeInstance,
        Logger: ConsoleLogger,
    });
    // Start tab organizer for organizing tabs
    const tabsOrganizerInstance = new TabsOrganizer({
        browser: tabsOrganizerBrowser,
        cache: memoryCache,
        store: storeInstance,
        tabsGrouper: tabsGrouperInstance,
        tabsSorter: tabsSorterInstance,
        Logger: ConsoleLogger,
    });
    tabsOrganizerInstance.connect();

    // Create various context menus that dictate client behaviour
    const contextMenu = new ContextMenu({
        browser: contextMenuBrowser,
        store: storeInstance,
        tabsGrouper: tabsGrouperInstance,
        tabsOrganizer: tabsOrganizerInstance,
        Logger: ConsoleLogger,
    });
    // Connect for creation and handling events
    contextMenu.connect();
}

initBackground();
