import { Counter as BookmarkCounter } from './bookmarks/Counter';
import { counterBrowser as bookmarkCounterBrowser } from './bookmarks/counterBrowser';
import { Organizer as TabsOrganizer } from './tabs/Organizer';
import { organizerBrowser as tabsOrganizerBrowser } from './tabs/organizerBrowser';
import { Menu as ContextMenu } from './context/Menu';
import { menuBrowser as contextMenuBrowser } from './context/menuBrowser';
import { Store } from './storage/Store';
import { storeBrowser } from './storage/storeBrowser';
import { ConsoleLogger } from './logs/ConsoleLogger';
import { MemoryCache } from './storage/MemoryCache';
import { Sorter } from './tabs/Sorter';
import { sorterBrowser } from './tabs/sorterBrowser';

// When the service worker starts
const logger = new ConsoleLogger();
logger.log('Service worker started');

/**
 * Initialize the background process
 * and all top-level listeners
 */
function initBackground() {
    // Load settings from storage into state
    const storeInstance = new Store({
        browser: storeBrowser,
        Logger: ConsoleLogger,
    });
    void storeInstance.load();

    // Create memory cache for group caching
    const memoryCache = new MemoryCache(ConsoleLogger);
    // Create tab sorter for sorting tabs
    const tabsSorterInstance = new Sorter({
        browser: sorterBrowser,
        store: storeInstance,
        Logger: ConsoleLogger,
    });
    // Start tab organizer for organizing tabs
    const tabsOrganizerInstance = new TabsOrganizer({
        browser: tabsOrganizerBrowser,
        cache: memoryCache,
        tabsSorter: tabsSorterInstance,
        store: storeInstance,
        Logger: ConsoleLogger,
    });
    tabsOrganizerInstance.connect();

    // Create various context menus that dictate client behaviour
    const contextMenu = new ContextMenu({
        browser: contextMenuBrowser,
        store: storeInstance,
        tabsOrganizer: tabsOrganizerInstance,
        Logger: ConsoleLogger,
    });
    // Connect for creation and handling events
    contextMenu.connect();

    // Start bookmark counter to track criteria matches
    if (ENABLE_BOOKMARK_COUNTER) {
        const bookmarkCounter = new BookmarkCounter({
            browser: bookmarkCounterBrowser,
            Logger: ConsoleLogger,
        });
        bookmarkCounter.connect();
    }
}

initBackground();
