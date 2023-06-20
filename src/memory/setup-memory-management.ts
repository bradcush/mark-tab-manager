import { logVerbose } from 'src/logs/console';
import { tabGroupsOnUpdated } from 'src/infra/browser/tab-groups/on-updated';
import { isTabGroupingSupported } from 'src/infra/browser/tab-groups/is-supported';
import { getPersistedStore } from 'src/storage/persisted-store-instance';
import { tabGroupsFreeMemory } from 'src/infra/business/tab-groups/free-memory';

/**
 * Connect memory management
 * for tabs within a group
 */
export function setupMemoryManagement(): void {
    logVerbose('setupMemoryManagement');
    if (isTabGroupingSupported()) {
        // Handle group updates for discarding inactive tabs
        // Handlers can be async since we just care to fire and forget
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        tabGroupsOnUpdated.addListener(async ({ collapsed, id }) => {
            logVerbose('tabGroupsOnUpdated', id);
            const { suspendCollapsedGroups } =
                await getPersistedStore().getState();
            const isEnabled = navigator.onLine && suspendCollapsedGroups;
            // Only suspend when enabled and collapsed
            if (!isEnabled || !collapsed) {
                return;
            }
            void tabGroupsFreeMemory(id);
        });
    }
}
