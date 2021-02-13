import { MkConstructorParams, MkCounter, MkCounterBrowser } from './MkCounter';
import { MkBrowser } from 'src/api/MkBrowser';
import { parseSharedDomain } from 'src/helpers/domainHelpers';
import { MkLogger } from 'src/logs/MkLogger';

/*
 * Responsible for finding matching bookmarks relevant to
 * the current tab and displaying that count information
 * in the extension icon badge
 */
export class Counter implements MkCounter {
    public constructor({ browser, Logger }: MkConstructorParams) {
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        if (!Logger) {
            throw new Error('No Logger');
        }
        this.logger = new Logger('bookmarks/Counter');
        this.logger.log('constructor');
    }

    private readonly browser: MkCounterBrowser;
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
            this.updateCountForTabId(tabId);
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
            this.updateCount(tab);
        });

        // Handle when a bookmark has been added
        this.browser.bookmarks.onCreated.addListener(() => {
            this.logger.log('browser.bookmarks.onCreated');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            void this.updateCountForActiveTab();
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
    private updateCount = (tab: MkBrowser.tabs.Tab) => {
        this.logger.log('updateCount', tab);
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

    /**
     * Set the bookmark count for the active tab
     */
    public async updateCountForActiveTab(): Promise<void> {
        this.logger.log('updateCountForActiveTab');
        const activeTab = await this.getActiveTab();
        this.updateCount(activeTab);
    }

    /**
     * Update the bookmark count for a specific tab
     */
    private updateCountForTabId(id: number) {
        this.logger.log('updateCountForTabId', id);
        this.browser.tabs.get(id, (tab) => {
            this.logger.log('browser.tabs.get', tab);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            this.updateCount(tab);
        });
    }
}
