import {
    MkAddNewGroupParams,
    MkGetGroupInfoParams,
    MkSortTab,
    MkUpdateGroupTitleParams,
} from './MkBar';
import { logVerbose } from 'src/logs/console';
import { query as tabGroupsQuery } from 'src/api/browser/tabGroups/query';
import { group as tabsGroup } from 'src/api/browser/tabs/group';
import { query as tabsQuery } from 'src/api/browser/tabs/query';
import { move as tabsMove } from 'src/api/browser/tabs/move';
import { ungroup as tabsUngroup } from 'src/api/browser/tabs/ungroup';
import { update as tabGroupsUpdate } from 'src/api/browser/tabGroups/update';
import { getColor as getTabGroupsColor } from 'src/api/browser/tabGroups/constants/Color';

/**
 * Get the color based on each index so that each index will
 * retain the same color regardless of a group re-render
 */
function getColorForGroup(index: number) {
    logVerbose('getColorForGroup', index);
    const colorsByEnum = getTabGroupsColor();
    logVerbose('getColorForGroup', colorsByEnum);
    const colorKeys = Object.keys(colorsByEnum);
    const colors = colorKeys.map((colorKey) => colorKey.toLocaleLowerCase());
    const colorIdx = index % colorKeys.length;
    const color = colors[colorIdx];
    logVerbose('getColorForGroup', color);
    return color;
}

/**
 * Get the current properties for a group with
 * a given name for a specific window id
 */
async function getGroupInfo({ id, title }: MkGetGroupInfoParams) {
    logVerbose('getGroupInfo', title);
    // Be careful of the title as query titles are patterns where
    // chars can have special meaning (eg. * is a universal selector)
    const queryInfo = { title, windowId: id };
    const tabGroups = await tabGroupsQuery(queryInfo);
    logVerbose('getGroupInfo', tabGroups);
    return tabGroups[0];
}

/**
 * Add new tab groups for a given name,
 * window id, and set of tab ids
 */
export async function group({
    idx,
    forceCollapse,
    tabIds,
    title,
    windowId,
}: MkAddNewGroupParams): Promise<void> {
    logVerbose('addNewGroup', title, windowId);
    const prevGroup = await getGroupInfo({
        id: windowId,
        title,
    });
    const createProperties = { windowId };
    const options = { createProperties, tabIds };
    const groupId = await tabsGroup(options);
    const color = getColorForGroup(idx);
    // Rely on the previous state when we don't force
    const collapsed = (forceCollapse || prevGroup?.collapsed) ?? false;
    void updateGroupProperties({
        collapsed,
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
 * Update an existing groups title
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
