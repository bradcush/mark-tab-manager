import { MkConstructorParams, MkCounter, MkCounterBrowser } from './MkCounter';
import { MkBrowser } from 'src/api/MkBrowser';
import { makeGroupName } from 'src/helpers/groupName';
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

        // Set the initial count on install and update
        this.browser.runtime.onInstalled.addListener((details) => {
            this.logger.log('browser.runtime.onInstalled', details);
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            // We have no shared dependencies
            if (details.reason === 'shared_module_update') {
                return;
            }
            void this.updateCountForActiveTab();
        });

        // Handle already loaded tabs that are focused
        this.browser.tabs.onActivated.addListener((activeInfo) => {
            this.logger.log('browser.tabs.onActivated', activeInfo);
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            const { tabId } = activeInfo;
            void this.updateCountForTabId(tabId);
        });

        this.browser.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
            this.logger.log('browser.tabs.onUpdated', tab);
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            // Only update the count for active tabs
            // of which there should only be one
            if (!tab.active) {
                return;
            }
            void this.updateCount(tab);
        });

        // Handle when a bookmark has been added
        this.browser.bookmarks.onCreated.addListener(() => {
            this.logger.log('browser.bookmarks.onCreated');
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            void this.updateCountForActiveTab();
        });
    }

    /**
     * Get the currently active browser tab
     */
    private async getActiveTab() {
        this.logger.log('getActiveTab');
        try {
            const queryInfo = { active: true, lastFocusedWindow: true };
            const tabs = await this.browser.tabs.query(queryInfo);
            return tabs[0];
        } catch (error) {
            this.logger.error('getActiveTab', error);
            throw error;
        }
    }

    /**
     * Update badge count and color
     */
    private async updateBadge(count: number) {
        this.logger.log('updateBadge', count);
        try {
            const color = count > 0 ? '#00F' : '#F00';
            const backgroundDetails = { color };
            await this.browser.action.setBadgeBackgroundColor(
                backgroundDetails
            );
            const textDetails = { text: `${count}` };
            await this.browser.action.setBadgeText(textDetails);
        } catch (error) {
            this.logger.error('updateBadge', error);
            throw error;
        }
    }

    /**
     * Update bookmark count based on the tab current URL second
     * level domain and the URL of any bookmarked site
     */
    private async updateCount(tab: MkBrowser.tabs.Tab) {
        this.logger.log('updateCount', tab);
        try {
            const url = tab.url || tab.pendingUrl;
            const groupName = makeGroupName({ type: 'shared', url });
            // Show the count of bookmarks matching the same
            // second level domain next to the popup icon
            const results = await this.browser.bookmarks.search(groupName);
            const bookmarksCount = results.length;
            void this.updateBadge(bookmarksCount);
        } catch (error) {
            this.logger.error('updateCount', error);
            throw error;
        }
    }

    /**
     * Set the bookmark count for the active tab
     */
    private async updateCountForActiveTab(): Promise<void> {
        this.logger.log('updateCountForActiveTab');
        const activeTab = await this.getActiveTab();
        void this.updateCount(activeTab);
    }

    /**
     * Update the bookmark count for a specific tab
     */
    private async updateCountForTabId(id: number) {
        this.logger.log('updateCountForTabId', id);
        try {
            const tab = await this.browser.tabs.get(id);
            void this.updateCount(tab);
        } catch (error) {
            this.logger.error('updateCountForActiveTab', error);
            throw error;
        }
    }
}
