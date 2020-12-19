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
     * Initialize tab organizer to trigger
     * on extension icon click
     */
    public init() {
        console.log('TabOrganizer.init');
        this.browser.action.onClicked.addListener(() => {
            console.log('TabOrganizer.browser.action.onClicked');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            this.orderAllTabs();
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
            // To reorganize existing tabs in the specified order
            // we add them one by one to the end of the list
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
