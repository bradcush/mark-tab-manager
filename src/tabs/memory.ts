import { discard as tabsDiscard } from 'src/api/browser/tabs/discard';
import { query as tabsQuery } from 'src/api/browser/tabs/query';
import { logVerbose } from 'src/logs/console';

/**
 * Discard a list of tabs that
 * haven't been discarded already
 */
export async function discardGroup(id: number): Promise<void> {
    logVerbose('discardGroup', id);
    // Only discard currently loaded tabs
    const queryInfo = { discarded: false, groupId: id };
    const tabs = await tabsQuery(queryInfo);
    tabs.forEach(({ id }) => {
        // Tabs without an id
        // can't be discarded
        if (!id) {
            return;
        }
        void tabsDiscard(id);
    });
}
