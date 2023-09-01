import { logVerbose } from 'src/logs/console';
import { getPersistedStore } from 'src/storage/persisted-store-instance';
import { makeTabIdsByGroup } from './make-tabids-by-group';
import { makeGroupName } from './domains/make-group-name';
import { makeSortName } from './domains/make-sort-name';

/**
 * Separate grouped tabs on the left
 * from isolated tabs on the right
 */
async function clusterTabs(tabs: chrome.tabs.Tab[]) {
    logVerbose('clusterTabs', tabs);
    const { enableSubdomainFiltering, forceWindowConsolidation } =
        await getPersistedStore().getState();
    const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
    const tabIdsByGroup = await makeTabIdsByGroup(tabs);
    // Determine if the tab is alone and not grouped
    const isIsolated = (tab: chrome.tabs.Tab) => {
        const groupName = makeGroupName(groupType, tab.url);
        // Specify the current window as the forced window
        const chosenWindowId = forceWindowConsolidation
            ? tabs[0].windowId
            : tab.windowId;
        logVerbose('clusterTabs', groupName, chosenWindowId);
        return tabIdsByGroup[groupName][chosenWindowId].length < 2;
    };
    const groupedTabs = tabs.filter((tab) => !isIsolated(tab));
    const isolatedTabs = tabs.filter(isIsolated);
    return [...groupedTabs, ...isolatedTabs];
}

/**
 * Sort tabs alphabetically based
 * on their URL and group setting
 */
async function alphabetizeTabs(tabs: chrome.tabs.Tab[]) {
    logVerbose('alphabetizeTabs', tabs);
    const { enableSubdomainFiltering } = await getPersistedStore().getState();
    return tabs.sort(({ url: urlOne }, { url: urlTwo }) => {
        if (!urlOne || !urlTwo) {
            throw new Error('No url for sorted tab');
        }
        const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
        const tabOneName = makeSortName(groupType, urlOne);
        const tabTwoName = makeSortName(groupType, urlTwo);
        return tabOneName.localeCompare(tabTwoName);
    });
}

/**
 * Sort tabs based on settings
 */
export async function treatTabOrder(
    tabs: chrome.tabs.Tab[],
): Promise<chrome.tabs.Tab[]> {
    logVerbose('treatTabOrder', tabs);
    const { enableAlphabeticSorting, clusterGroupedTabs } =
        await getPersistedStore().getState();
    // Mutation better illustrates compound intent
    let treatedTabs: chrome.tabs.Tab[] = tabs;
    if (enableAlphabeticSorting) {
        treatedTabs = await alphabetizeTabs(treatedTabs);
    }
    if (clusterGroupedTabs) {
        treatedTabs = await clusterTabs(treatedTabs);
    }
    return treatedTabs;
}
