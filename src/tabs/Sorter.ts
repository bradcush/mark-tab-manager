import { MkStore } from 'src/storage/MkStore';
import { MkClusterParams, MkSorter, MkSortParams } from './MkSorter';
import { MkBrowser } from 'src/api/MkBrowser';
import { makeSortName } from 'src/helpers/sortName';
import { makeGroupName } from 'src/helpers/groupName';
import { browser } from 'src/api/browser';
import { logError, logVerbose } from 'src/logs/console';

/**
 * Sorting of tabs
 */
export class Sorter implements MkSorter {
    public constructor(store: MkStore) {
        if (!store) {
            throw new Error('No store');
        }
        this.store = store;

        logVerbose('constructor');
    }

    private readonly store: MkStore;

    /**
     * Compare to be used with name sorting
     */
    private compareNames(a: string, b: string) {
        return a.localeCompare(b);
    }

    /**
     * Separate grouped tabs from orphans
     */
    private async cluster({ tabGroups, tabs }: MkClusterParams) {
        logVerbose('cluster', tabGroups, tabs);
        const {
            enableSubdomainFiltering,
            forceWindowConsolidation,
        } = await this.store.getState();
        const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
        // Determine if the tab is alone and not
        // supposed to belong to any group
        const isOrphan = (tab: MkBrowser.tabs.Tab) => {
            const groupName = makeGroupName({ type: groupType, url: tab.url });
            // Specify the current window as the forced window
            const chosenWindowId = forceWindowConsolidation
                ? tabs[0].windowId
                : tab.windowId;
            logVerbose('cluster', groupName, chosenWindowId);
            return tabGroups[groupName][chosenWindowId].length < 2;
        };
        const groupedTabs = tabs.filter((tab) => !isOrphan(tab));
        const orphanTabs = tabs.filter(isOrphan);
        // Groups on the left and singles on the right
        return [...groupedTabs, ...orphanTabs];
    }

    /**
     * Remove tabs that are pinned from the list
     */
    public filter(tabs: MkBrowser.tabs.Tab[]): MkBrowser.tabs.Tab[] {
        logVerbose('filter');
        const isTabPinned = (tab: MkBrowser.tabs.Tab) => !!tab.pinned;
        const nonPinnedTabs = tabs.filter((tab) => !isTabPinned(tab));
        return nonPinnedTabs;
    }

    /**
     * Sort tabs based on settings
     */
    public async sort({
        groups,
        tabs,
    }: MkSortParams): Promise<MkBrowser.tabs.Tab[]> {
        logVerbose('sort', tabs);
        const {
            enableAlphabeticSorting,
            clusterGroupedTabs,
        } = await this.store.getState();
        const alphabetizedTabs = enableAlphabeticSorting
            ? await this.alphabetize(tabs)
            : tabs;
        return clusterGroupedTabs
            ? this.cluster({ tabGroups: groups, tabs: alphabetizedTabs })
            : alphabetizedTabs;
    }

    /**
     * Sort tabs alphabetically with nuance
     */
    private async alphabetize(unsortedTabs: MkBrowser.tabs.Tab[]) {
        logVerbose('alphabetize', unsortedTabs);
        const { enableSubdomainFiltering } = await this.store.getState();
        return unsortedTabs.sort((a, b) => {
            const urlOne = a.url;
            const urlTwo = b.url;
            if (!urlOne || !urlTwo) {
                throw new Error('No url for sorted tab');
            }
            const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
            const tabOneName = makeSortName({ type: groupType, url: urlOne });
            const tabTwoName = makeSortName({ type: groupType, url: urlTwo });
            return this.compareNames(tabOneName, tabTwoName);
        });
    }

    /**
     * Reorder browser tabs in the current
     * window according to tabs list
     */
    public async render(tabs: MkBrowser.tabs.Tab[]): Promise<void> {
        logVerbose('render', tabs);
        try {
            // Not using "chrome.windows.WINDOW_ID_CURRENT" as we rely on real
            // "windowId" in our algorithm which the representative -2 breaks
            const staticWindowId = tabs[0].windowId;
            const { forceWindowConsolidation } = await this.store.getState();
            // We only care about catching errors with await in this case
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
                await browser.tabs.move(id, moveProperties);
            });
        } catch (error) {
            logError('render', error);
            throw error;
        }
    }
}
