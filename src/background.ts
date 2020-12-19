import { BookmarkCounter } from './bookmarks/BookmarkCounter';
import { counterBrowser } from './bookmarks/counterBrowser';
import { TabOrganizer } from './tabs/TabOrganizer';
import { tabOrganizerBrowser } from './tabs/tabOrganizerBrowser';

// When the service worker starts
console.log('Service worker started');

// Start bookmark counter to track criteria matches
const bookmarkCounter = new BookmarkCounter(counterBrowser);
bookmarkCounter.init();

// Start tab organizer for sorting tabs
const tabOrganizer = new TabOrganizer(tabOrganizerBrowser);
tabOrganizer.init();
