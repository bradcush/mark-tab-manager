import { MkToBrowser, MkTabOrganizer } from './MkTabOrganizer';
import { MkBrowser } from 'src/api/MkBrowser';
import { parseSharedDomain } from 'src/helpers/domainHelpers';

/**
 * Organize open tabs
 */
export class TabOrganizer implements MkTabOrganizer {
    public constructor(browser: MkToBrowser) {
        console.log('TabOrganizer.constructor');
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;
    }

    private readonly browser: MkToBrowser;

    /**
     * Initialize tab organizer to trigger on extension
     * icon click or automatic tab URL update
     */
    public init() {
        console.log('TabOrganizer.init');

        // Handle when the extension icon is clicked
        this.browser.action.onClicked.addListener(() => {
            console.log('TabOrganizer.browser.action.onClicked');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            this.orderAllTabs();
        });

        // Handle tabs where a URL is updated
        this.browser.tabs.onUpdated.addListener(async (_tabId, changeInfo) => {
            console.log('TabOrganizer.browser.tabs.onUpdated', changeInfo);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            // We only want automatic sort if enabled
            const isAutomaticSortingEnabled = await this.getEnableAutomaticSorting();
            if (!isAutomaticSortingEnabled) {
                return;
            }
            // TODO: We could only update the order if the domain has changed
            // but this would require keeping track of a tabs previous state
            // which might not be worth the added complexity.
            const hasUrlChanged = !!changeInfo.url;
            if (!hasUrlChanged) {
                return;
            }
            this.orderAllTabs();
        });
    }

    /**
     * Get the determiner for if we want automatic sorting
     * TODO: This function should be part of a storage/settings service
     */
    private getEnableAutomaticSorting() {
        console.log('TabOrganizer.getEnableAutomaticSorting');
        return new Promise((resolve) => {
            this.browser.storage.sync.get('enableAutomaticSorting', (items) => {
                console.log('TabOrganizer.browser.storage.sync', items);
                const lastError = this.browser.runtime.lastError;
                if (lastError) {
                    throw lastError;
                }
                resolve(items.enableAutomaticSorting);
            });
        });
    }

    /**
     * Order all tabs alphabetically
     */
    private orderAllTabs() {
        console.log('TabOrganizer.orderAllTabs');
        this.browser.tabs.query({}, (tabs) => {
            console.log('TabOrganizer.browser.tabs.query', tabs);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            const sortedTabs = this.sortTabsAlphabetically(tabs);
            this.reorderBrowserTabs(sortedTabs);
        });
    }

    /**
     * Reorder browser tabs in the current
     * window according to tabs list
     */
    private reorderBrowserTabs(tabs: MkBrowser.tabs.Tab[]) {
        console.log('TabOrganizer.reorderBrowserTabs', tabs);
        tabs.forEach((tab) => {
            const { id } = tab;
            if (!id) {
                throw new Error(`No id for sorted tab: ${id}`);
            }
            const moveProperties = { index: -1 };
            this.browser.tabs.move(id, moveProperties, () => {
                const lastError = this.browser.runtime.lastError;
                if (lastError) {
                    throw lastError;
                }
            });
        });
    }

    /**
     * Sort tabs alphabetically using their hostname
     */
    private sortTabsAlphabetically(tabs: MkBrowser.tabs.Tab[]) {
        console.log('TabOrganizer.sortTabsAlphabetically', tabs);
        const sortedTabs = tabs.sort((a, b) => {
            if (!a.url || !b.url) {
                throw new Error('No url for sorted tab');
            }
            // TODO: Handle exception when we try to create a URL object
            // from a URL that isn't supported (eg. chrome://newtab)
            const firstTabUrl = new URL(a.url);
            const firstTabHostname = firstTabUrl.hostname;
            const firstTabDomain = parseSharedDomain(firstTabHostname);
            const secondTabUrl = new URL(b.url);
            const secondTabHostname = secondTabUrl.hostname;
            const secondTabDomain = parseSharedDomain(secondTabHostname);
            return firstTabDomain.localeCompare(secondTabDomain);
        });
        return sortedTabs;
    }
}
