import { tabsQuery } from 'src/infra/browser/tabs/query';
import { tabsUngroup } from 'src/infra/browser/tabs/ungroup';

/**
 * Remove a list of tabs or all tabs from any
 * group and the group itself when empty
 */
export async function tabsUngroupAll(): Promise<void> {
    const tabs = await tabsQuery({});
    const filterIds = (id: number | undefined): id is number =>
        typeof id !== 'undefined';
    const idsToUngroup = tabs.map((tab) => tab.id).filter(filterIds);
    await tabsUngroup(idsToUngroup);
}
