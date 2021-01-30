import {
    MkBookmarkCounter,
    MkBookmarkCounterBrowser,
} from './MkBookmarkCounter';
import { MkBrowser } from 'src/api/MkBrowser';
import { parseSharedDomain } from 'src/helpers/domainHelpers';

/*
 * Responsible for tracking matching bookmarks relevant to the current tab
 * and displaying that count information in the extension icon badge
 */
export class BookmarkCounter implements MkBookmarkCounter {
    public constructor(browser: MkBookmarkCounterBrowser) {
        console.log('BookmarkCounter.constructor');
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;
    }

    private readonly browser: MkBookmarkCounterBrowser;

    /**
     * Connect handlers to browser events for when
     * the bookmark count needs to be updated
     */
    public connect(): void {
        console.log('BookmarkCounter.init');

        // Handle already loaded tabs that are focused
        this.browser.tabs.onActivated.addListener((activeInfo) => {
            console.log('BookmarkCounter.browser.tabs.onActivated', activeInfo);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            const { tabId } = activeInfo;
            this.setTabBookmarkCount(tabId);
        });

        this.browser.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
            console.log('BookmarkCounter.browser.tabs.onUpdated', tab);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            // Only update the count for active tabs
            // of which there should only be one
            if (!tab.active) {
                return;
            }
            this.updateBookmarkCount(tab);
        });

        // Handle when a bookmark has been added
        this.browser.bookmarks.onCreated.addListener(() => {
            console.log('BookmarkCounter.browser.bookmarks.onCreated');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            void this.setActiveTabBookmarkCount();
        });
    }

    /**
     * Get the currently active browser tab
     */
    private async getActiveTab() {
        console.log('BookmarkCounter.getActiveTab');
        const queryInfo = { active: true, lastFocusedWindow: true };
        const tabs = await this.browser.tabs.query(queryInfo);
        return tabs[0];
    }

    /**
     * Set the bookmark count for the active tab
     */
    public async setActiveTabBookmarkCount(): Promise<void> {
        console.log('BookmarkCounter.setActiveTabBookmarkCount');
        const activeTab = await this.getActiveTab();
        this.updateBookmarkCount(activeTab);
    }

    /**
     * Update the bookmark count for a specific tab
     */
    private setTabBookmarkCount(id: number) {
        console.log('setTabBookmarkCount', id);
        this.browser.tabs.get(id, (tab) => {
            console.log('BookmarkCounter.browser.tabs.get', tab);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            this.updateBookmarkCount(tab);
        });
    }

    /**
     * Update badge count and color
     */
    private updateBadge(count: number) {
        console.log('BookmarkCounter.updateBadge', count);
        const color = count > 0 ? '#00F' : '#F00';
        const backgroundDetails = { color };
        this.browser.action.setBadgeBackgroundColor(backgroundDetails, () => {
            console.log(
                'BookmarkCounter.browser.action.setBadgeBackgroundColor'
            );
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
        });
        const textDetails = { text: `${count}` };
        this.browser.action.setBadgeText(textDetails, () => {
            console.log('BookmarkCounter.browser.action.setBadgeText');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
        });
    }

    /**
     * Update bookmark count based on the tab current URL second
     * level domain and the URL of any bookmarked site
     */
    private updateBookmarkCount = (tab: MkBrowser.tabs.Tab) => {
        console.log('BookmarkCounter.updateBookmarkCount', tab);
        const url = tab.url || tab.pendingUrl;
        const { hostname } = url ? new URL(url) : { hostname: '' };
        const domainName = parseSharedDomain(hostname);
        // Show the count of bookmarks matching the same
        // second level domain next to the popup icon
        this.browser.bookmarks.search(domainName, (results) => {
            console.log('BookmarkCounter.browser.bookmarks.search', results);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            const bookmarksCount = results.length;
            this.updateBadge(bookmarksCount);
        });
    };
}
