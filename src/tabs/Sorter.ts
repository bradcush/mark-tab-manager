import { MkStore } from 'src/storage/MkStore';
import { MkLogger } from 'src/logs/MkLogger';
import { makeGroupName } from 'src/helpers/groupName';
import { MkContstructorParams, MkSorter, MkSorterBrowser } from './MkSorter';
import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Sorting of tabs
 */
export class Sorter implements MkSorter {
    public constructor({ browser, store, Logger }: MkContstructorParams) {
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        if (!store) {
            throw new Error('No store');
        }
        this.store = store;

        if (!Logger) {
            throw new Error('No Logger');
        }
        this.logger = new Logger('tabs/Sorter');
        this.logger.log('constructor');
    }

    private readonly browser: MkSorterBrowser;
    private readonly logger: MkLogger;
    private readonly store: MkStore;

    /**
     * Compare to be used with sorting where newtab should
     * be last and specifically in reference to that group
     */
    private compareGroups(a: string, b: string) {
        if (a === b) {
            return 0;
        }
        if (a === 'new') {
            return 1;
        }
        if (b === 'new') {
            return -1;
        }
        return a.localeCompare(b);
    }

    /**
     * Sort tabs alphabetically using their hostname
     * with exceptions for some specific groups
     */
    public async sort(
        tabs: MkBrowser.tabs.Tab[]
    ): Promise<MkBrowser.tabs.Tab[]> {
        this.logger.log('sort', tabs);
        const { enableSubdomainFiltering } = await this.store.getState();
        const sortedTabs = tabs.sort((a, b) => {
            const urlOne = a.url;
            const urlTwo = b.url;
            if (!urlOne || !urlTwo) {
                throw new Error('No url for sorted tab');
            }
            const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
            const groupOne = makeGroupName({ type: groupType, url: urlOne });
            const groupTwo = makeGroupName({ type: groupType, url: urlTwo });
            return this.compareGroups(groupOne, groupTwo);
        });
        return sortedTabs;
    }

    /**
     * Reorder browser tabs in the current
     * window according to tabs list
     */
    public async render(tabs: MkBrowser.tabs.Tab[]): Promise<void> {
        this.logger.log('render', tabs);
        try {
            // Not using "chrome.windows.WINDOW_ID_CURRENT" as we rely on real
            // "windowId" in our algorithm which the representative -2 breaks
            const staticWindowId = tabs[0].windowId;
            const { forceWindowConsolidation } = await this.store.getState();
            /* eslint-disable @typescript-eslint/no-misused-promises */
            tabs.forEach(async (tab) => {
                const { id } = tab;
                if (!id) {
                    throw new Error('No id for sorted tab');
                }
                const baseMoveProperties = { index: -1 };
                // Specify the current window as the forced window
                const staticWindowMoveProperties = {
                    windowId: staticWindowId,
                };
                // Current default uses the window for the current tab
                const moveProperties = forceWindowConsolidation
                    ? { ...baseMoveProperties, ...staticWindowMoveProperties }
                    : baseMoveProperties;
                // We expect calls to move to still run in parallel
                // but await simply to catch errors properly
                await this.browser.tabs.move(id, moveProperties);
            });
        } catch (error) {
            this.logger.error('render', error);
            throw error;
        }
    }
}
