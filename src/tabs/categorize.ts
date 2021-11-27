import { MkTabIdsByGroup } from './MkCategorize';
import { makeGroupName } from 'src/helpers/groupName';
import { getStore } from 'src/storage/Store';
import { logVerbose } from 'src/logs/console';
import { MkOrganizationTab } from './MkOrganize';

/**
 * Categorize tabs by their group name and window id
 */
export async function categorize(
    tabs: MkOrganizationTab[]
): Promise<MkTabIdsByGroup> {
    logVerbose('group');
    const {
        enableSubdomainFiltering,
        forceWindowConsolidation,
    } = await getStore().getState();
    // Not using "chrome.windows.WINDOW_ID_CURRENT" as we rely on real
    // "windowId" in our algorithm which the representative -2 breaks
    const staticWindowId = tabs[0].windowId;
    const tabIdsByGroup = tabs.reduce<MkTabIdsByGroup>((acc, tab) => {
        const { id, url, windowId } = tab;
        if (!id) {
            throw new Error('No id for tab');
        }
        // Don't group tabs without a URL
        if (!url) {
            throw new Error('No tab url');
        }
        const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
        const groupName = makeGroupName({ type: groupType, url });
        // Specify the current window as the forced window
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
    logVerbose('group', tabIdsByGroup);
    return tabIdsByGroup;
}
