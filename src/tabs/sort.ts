import { MkClusterParams, MkSortParams } from './MkSort';
import { MkBrowser } from 'src/api/MkBrowser';
import { makeSortName } from 'src/helpers/sortName';
import { makeGroupName } from 'src/helpers/groupName';
import { browser } from 'src/api/browser';
import { logError, logVerbose } from 'src/logs/console';
import { getStore } from 'src/storage/Store';

/**
 * Compare to be used with name sorting
 */
function compareNames(a: string, b: string) {
    return a.localeCompare(b);
}

/**
 * Separate grouped tabs from orphans
 */
async function cluster({ tabGroups, tabs }: MkClusterParams) {
    logVerbose('cluster', tabGroups, tabs);
    const {
        enableSubdomainFiltering,
        forceWindowConsolidation,
    } = await getStore().getState();
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
export function filter(tabs: MkBrowser.tabs.Tab[]): MkBrowser.tabs.Tab[] {
    logVerbose('filter');
    const isTabPinned = (tab: MkBrowser.tabs.Tab) => !!tab.pinned;
    const nonPinnedTabs = tabs.filter((tab) => !isTabPinned(tab));
    return nonPinnedTabs;
}

/**
 * Sort tabs based on settings
 */
export async function sort({
    groups,
    tabs,
}: MkSortParams): Promise<MkBrowser.tabs.Tab[]> {
    logVerbose('sort', tabs);
    const {
        enableAlphabeticSorting,
        clusterGroupedTabs,
    } = await getStore().getState();
    const alphabetizedTabs = enableAlphabeticSorting
        ? await alphabetize(tabs)
        : tabs;
    return clusterGroupedTabs
        ? cluster({ tabGroups: groups, tabs: alphabetizedTabs })
        : alphabetizedTabs;
}

/**
 * Sort tabs alphabetically with nuance
 */
async function alphabetize(unsortedTabs: MkBrowser.tabs.Tab[]) {
    logVerbose('alphabetize', unsortedTabs);
    const { enableSubdomainFiltering } = await getStore().getState();
    return unsortedTabs.sort((a, b) => {
        const urlOne = a.url;
        const urlTwo = b.url;
        if (!urlOne || !urlTwo) {
            throw new Error('No url for sorted tab');
        }
        const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
        const tabOneName = makeSortName({ type: groupType, url: urlOne });
        const tabTwoName = makeSortName({ type: groupType, url: urlTwo });
        return compareNames(tabOneName, tabTwoName);
    });
}

/**
 * Reorder browser tabs in the current
 * window according to tabs list
 */
export async function render(tabs: MkBrowser.tabs.Tab[]): Promise<void> {
    try {
        logVerbose('render', tabs);
        // Not using "chrome.windows.WINDOW_ID_CURRENT" as we rely on real
        // "windowId" in our algorithm which the representative -2 breaks
        const staticWindowId = tabs[0].windowId;
        const { forceWindowConsolidation } = await getStore().getState();
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
