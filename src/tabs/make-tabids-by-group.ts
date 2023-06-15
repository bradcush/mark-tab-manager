import { logVerbose } from 'src/logs/console';
import { TabIdsByGroup } from './tabs-types';
import { getPersistedStore } from 'src/storage/persisted-store-instance';
import { makeGroupName } from './domains/make-group-name';

/**
 * Categorize tab ids by their group
 * name followed by the window id
 *
 * @example
 * {
 *     'group-name': {
 *         1: [1, 2, 3],
 *         2: [4, 5, 6],
 *     }
 * }
 */
export async function makeTabIdsByGroup(
    tabs: chrome.tabs.Tab[]
): Promise<TabIdsByGroup> {
    logVerbose('makeTabIdsByGroup', tabs);
    const { enableSubdomainFiltering, forceWindowConsolidation } =
        await getPersistedStore().getState();
    // Not using "chrome.windows.WINDOW_ID_CURRENT" as we rely on real
    // "windowId" in our algorithm which the representative -2 breaks
    const staticWindowId = tabs[0].windowId;
    return tabs.reduce<TabIdsByGroup>((acc, tab) => {
        const { id, url, windowId } = tab;
        if (!id) {
            throw new Error('No id for tab');
        }
        if (!url) {
            throw new Error('No tab url');
        }
        const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
        const groupName = makeGroupName(groupType, url);
        // Specify the current window as forced
        const chosenWindowId = forceWindowConsolidation
            ? staticWindowId
            : windowId;
        if (!acc[groupName]) {
            acc[groupName] = {
                [chosenWindowId]: [id],
            };
        } else if (!acc[groupName][chosenWindowId]) {
            acc[groupName] = {
                ...acc[groupName],
                [chosenWindowId]: [id],
            };
        } else {
            acc[groupName][chosenWindowId].push(id);
        }
        return acc;
    }, {});
}
