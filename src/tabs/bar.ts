import {
    MkAddNewGroupParams,
    MkSortTab,
    MkUpdateGroupTitleParams,
} from './MkBar';
import { logVerbose } from 'src/logs/console';
import { group as tabsGroup } from 'src/api/browser/tabs/group';
import { query as tabsQuery } from 'src/api/browser/tabs/query';
import { move as tabsMove } from 'src/api/browser/tabs/move';
import { ungroup as tabsUngroup } from 'src/api/browser/tabs/ungroup';
import { update as tabGroupsUpdate } from 'src/api/browser/tabGroups/update';

/**
 * Add and update tab groups based on
 * a given set of display options
 */
export async function group({
    color,
    opened,
    tabIds,
    title,
    windowId,
}: MkAddNewGroupParams): Promise<void> {
    logVerbose('addNewGroup', title, windowId);
    const createProperties = { windowId };
    const options = { createProperties, tabIds };
    const groupId = await tabsGroup(options);
    void updateGroupProperties({
        collapsed: !opened,
        color,
        groupId,
        title,
    });
}

/**
 * Get a list of all valid tab ids
 */
async function queryAllTabIds() {
    const tabs = await tabsQuery({});
    const filterIds = (id: number | undefined): id is number =>
        typeof id !== 'undefined';
    return tabs.map((tab) => tab.id).filter(filterIds);
}

/**
 * Update sorting of tabs in tab bar
 */
export function sort(tabs: MkSortTab[]): void {
    // We only care about catching errors with await in this case
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    tabs.forEach(async ({ identifier, windowId }) => {
        logVerbose('sort', tabs);
        if (!identifier) {
            throw new Error('No identifier for sorted tab');
        }
        const baseMoveProperties = { index: -1 };
        const staticWindowMoveProperties = { windowId };
        // Current default uses the window for the current tab
        const moveProperties =
            typeof windowId !== 'undefined'
                ? { ...baseMoveProperties, ...staticWindowMoveProperties }
                : baseMoveProperties;
        // We expect calls to move to still run in parallel
        // but await simply to catch errors properly
        await tabsMove(identifier, moveProperties);
    });
}

/**
 * Remove a list of tabs or all tabs from any
 * group and the group itself when empty
 */
export async function ungroup(ids?: number[]): Promise<void> {
    logVerbose('remove', ids);
    const idsToUngroup = ids ? ids : await queryAllTabIds();
    await tabsUngroup(idsToUngroup);
}

/**
 * Create or update a group
 */
async function updateGroupProperties({
    collapsed,
    color,
    groupId,
    title,
}: MkUpdateGroupTitleParams) {
    logVerbose('updateGroupProperties', color);
    const updateProperties = { collapsed, color, title };
    await tabGroupsUpdate(groupId, updateProperties);
}
