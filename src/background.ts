import { BookmarkCounter } from './bookmarks/BookmarkCounter';
import { counterBrowser } from './bookmarks/counterBrowser';
import { TabOrganizer } from './tabs/TabOrganizer';
import { tabOrganizerBrowser } from './tabs/tabOrganizerBrowser';
import { ContextMenusService } from './context/ContextMenusService';
import { contextBrowser } from './context/contextBrowser';
import { StorageService } from './storage/StorageService';
import { storageBrowser } from './storage/storageBrowser';

// When the service worker starts
console.log('Service worker started');

async function initBackground() {
    // Load settings from storage into state
    const storageService = new StorageService(storageBrowser);
    await storageService.init();

    // Create various context menus that dictate client behaviour
    const contextMenusService = new ContextMenusService({
        browser: contextBrowser,
        storage: storageService,
    });
    contextMenusService.init();

    // Start bookmark counter to track criteria matches
    const bookmarkCounter = new BookmarkCounter(counterBrowser);
    bookmarkCounter.init();

    // Start tab organizer for sorting tabs
    const tabOrganizer = new TabOrganizer({
        browser: tabOrganizerBrowser,
        storage: storageService,
    });
    tabOrganizer.init();
}

initBackground();
