import { BookmarkCounter } from './bookmarks/BookmarkCounter';
import { bookmarkCounterBrowser } from './bookmarks/bookmarkCounterBrowser';
import { SiteOrganizer } from './tabs/SiteOrganizer';
import { siteOrganizerBrowser } from './tabs/siteOrganizerBrowser';
import { ContextMenu } from './context/ContextMenu';
import { contextMenuBrowser } from './context/contextMenuBrowser';
import { Store } from './storage/Store';
import { storeBrowser } from './storage/storeBrowser';

// When the service worker starts
console.log('Service worker started');

async function initBackground() {
    // Load settings from storage into state
    const storeInstance = new Store(storeBrowser);
    await storeInstance.load();

    // Create various context menus that dictate client behaviour
    const contextMenu = new ContextMenu({
        browser: contextMenuBrowser,
        store: storeInstance,
    });
    contextMenu.create();

    // Start bookmark counter to track criteria matches
    if (ENABLE_BOOKMARK_COUNTER) {
        const bookmarkCounter = new BookmarkCounter(bookmarkCounterBrowser);
        bookmarkCounter.init();
    }

    // Start tab organizer for sorting tabs
    const siteOrganizer = new SiteOrganizer({
        browser: siteOrganizerBrowser,
        store: storeInstance,
    });
    siteOrganizer.connect();

    // Organize on extension initialization
    const state = storeInstance.getState();
    const isAutomaticSortingEnabled = state.enableAutomaticSorting;
    if (isAutomaticSortingEnabled) {
        siteOrganizer.organize();
    }
}

void initBackground();
