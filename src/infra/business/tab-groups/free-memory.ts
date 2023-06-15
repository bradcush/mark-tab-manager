import { tabsDiscard } from 'src/infra/browser/tabs/discard';
import { tabsQuery } from 'src/infra/browser/tabs/query';

/**
 * Discard a list of tabs that
 * haven't been discarded already
 */
export async function tabGroupsFreeMemory(id: number): Promise<void> {
    // Only discard currently loaded tabs
    const queryInfo = { discarded: false, groupId: id };
    const tabs = await tabsQuery(queryInfo);
    tabs.forEach(({ id }) => {
        if (!id) {
            return;
        }
        void tabsDiscard(id);
    });
}
