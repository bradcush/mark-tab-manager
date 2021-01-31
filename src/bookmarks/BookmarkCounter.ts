import {
    MkBookmarkCounter,
    MkBookmarkCounterBrowser,
    MkConstructorParams,
} from './MkBookmarkCounter';
import { MkBrowser } from 'src/api/MkBrowser';
import { parseSharedDomain } from 'src/helpers/domainHelpers';
import { MkLogger } from 'src/logs/MkLogger';

/*
 * Responsible for tracking matching bookmarks relevant to the current tab
 * and displaying that count information in the extension icon badge
 */
export class BookmarkCounter implements MkBookmarkCounter {
    public constructor({ browser, Logger }: MkConstructorParams) {
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        if (!Logger) {
            throw new Error('No Logger');
        }
        this.logger = new Logger('BookmarkCounter');
        this.logger.log('constructor');
    }

    private readonly browser: MkBookmarkCounterBrowser;
    private readonly logger: MkLogger;

    /**
     * Connect handlers to browser events for when
     * the bookmark count needs to be updated
     */
    public connect(): void {
        this.logger.log('connect');

        // Handle already loaded tabs that are focused
        this.browser.tabs.onActivated.addListener((activeInfo) => {
            this.logger.log('browser.tabs.onActivated', activeInfo);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            const { tabId } = activeInfo;
            this.setTabBookmarkCount(tabId);
        });

        this.browser.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
            this.logger.log('browser.tabs.onUpdated', tab);
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
            this.logger.log('browser.bookmarks.onCreated');
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
        this.logger.log('getActiveTab');
        const queryInfo = { active: true, lastFocusedWindow: true };
        const tabs = await this.browser.tabs.query(queryInfo);
        return tabs[0];
    }

    /**
     * Set the bookmark count for the active tab
     */
    public async setActiveTabBookmarkCount(): Promise<void> {
        this.logger.log('setActiveTabBookmarkCount');
        const activeTab = await this.getActiveTab();
        this.updateBookmarkCount(activeTab);
    }

    /**
     * Update the bookmark count for a specific tab
     */
    private setTabBookmarkCount(id: number) {
        this.logger.log('setTabBookmarkCount', id);
        this.browser.tabs.get(id, (tab) => {
            this.logger.log('browser.tabs.get', tab);
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
        this.logger.log('updateBadge', count);
        const color = count > 0 ? '#00F' : '#F00';
        const backgroundDetails = { color };
        this.browser.action.setBadgeBackgroundColor(backgroundDetails, () => {
            this.logger.log('browser.action.setBadgeBackgroundColor');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
        });
        const textDetails = { text: `${count}` };
        this.browser.action.setBadgeText(textDetails, () => {
            this.logger.log('browser.action.setBadgeText');
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
        this.logger.log('updateBookmarkCount', tab);
        const url = tab.url || tab.pendingUrl;
        const { hostname } = url ? new URL(url) : { hostname: '' };
        const domainName = parseSharedDomain(hostname);
        // Show the count of bookmarks matching the same
        // second level domain next to the popup icon
        this.browser.bookmarks.search(domainName, (results) => {
            this.logger.log('browser.bookmarks.search', results);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            const bookmarksCount = results.length;
            this.updateBadge(bookmarksCount);
        });
    };
}
