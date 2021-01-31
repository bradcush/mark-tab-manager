import { BookmarkCounter } from './bookmarks/BookmarkCounter';
import { bookmarkCounterBrowser } from './bookmarks/bookmarkCounterBrowser';
import { SiteOrganizer } from './tabs/SiteOrganizer';
import { siteOrganizerBrowser } from './tabs/siteOrganizerBrowser';
import { ContextMenu } from './context/ContextMenu';
import { contextMenuBrowser } from './context/contextMenuBrowser';
import { Store } from './storage/Store';
import { storeBrowser } from './storage/storeBrowser';
import { ConsoleLogger } from './logs/ConsoleLogger';

// When the service worker starts
const logger = new ConsoleLogger();
logger.log('Service worker started');

async function initBackground() {
    // Load settings from storage into state
    const storeInstance = new Store({
        browser: storeBrowser,
        Logger: ConsoleLogger,
    });
    await storeInstance.load();

    // Create various context menus that dictate client behaviour
    const contextMenu = new ContextMenu({
        browser: contextMenuBrowser,
        store: storeInstance,
        Logger: ConsoleLogger,
    });
    await contextMenu.create();
    contextMenu.connect();

    // Start bookmark counter to track criteria matches
    if (ENABLE_BOOKMARK_COUNTER) {
        const bookmarkCounter = new BookmarkCounter({
            browser: bookmarkCounterBrowser,
            Logger: ConsoleLogger,
        });
        bookmarkCounter.connect();
        // Set the initial count based the current tab
        void bookmarkCounter.setActiveTabBookmarkCount();
    }

    // Start tab organizer for sorting tabs
    const siteOrganizer = new SiteOrganizer({
        browser: siteOrganizerBrowser,
        store: storeInstance,
        Logger: ConsoleLogger,
    });
    siteOrganizer.connect();

    // Organize on extension initialization
    const state = await storeInstance.getState();
    const isAutomaticSortingEnabled = state.enableAutomaticSorting;
    if (isAutomaticSortingEnabled) {
        void siteOrganizer.organize();
    }
}

void initBackground();
