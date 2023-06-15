import { tabsOnUpdated } from 'src/infra/browser/tabs/on-updated';
import { tabsOnRemoved } from 'src/infra/browser/tabs/on-removed';
import { getMemoryCache } from 'src/storage/memory-cache-instance';
import { getPersistedStore } from 'src/storage/persisted-store-instance';
import { makeGroupName } from './domains/make-group-name';
import { organizeTabs } from './organize-tabs';
import { logVerbose } from 'src/logs/console';

/**
 * Has the group assignation for a tab changed based
 * on it's url relative to what's in the cache
 */
async function hasGroupChanged(currentUrl: string, id: number) {
    logVerbose('hasGroupChanged', currentUrl);
    const { enableSubdomainFiltering } = await getPersistedStore().getState();
    const groupType = enableSubdomainFiltering ? 'granular' : 'shared';
    const groupName = makeGroupName(groupType, currentUrl);
    return getMemoryCache().get(id) !== groupName;
}

/**
 * Based on information about an updated tab we
 * determine if organization should be done
 */
async function shouldUpdate(
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo
) {
    logVerbose('shouldUpdate');
    const { status, url } = changeInfo;
    // Prevent triggering of updates when we aren't loading
    // so we can treat tabs as early as possible
    if (status !== 'loading') {
        return false;
    }
    // If there is no url change we don't consider updating its
    // group. (It's observed that only loading tabs can have a url
    // and that reloading a tab doesn't send a url)
    if (!url) {
        return false;
    }
    // If the group assignation didn't change
    // then we don't bother to organize
    if (!(await hasGroupChanged(url, tabId))) {
        return false;
    }
    return true;
}

/**
 * Connect site organizer to events
 * where tabs have been updated
 */
export function setupTabsManagement(): void {
    logVerbose('setupTabsManagement');

    // Handle tabs where a URL is updated
    // TODO: Possible bug when not using groups
    tabsOnUpdated.addListener(
        // Handlers can be async since we just care to fire and forget
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (tabId, changeInfo, tab) => {
            logVerbose('tabsOnUpdated', changeInfo);
            if (await shouldUpdate(tabId, changeInfo)) {
                void organizeTabs({
                    updatedTab: tab,
                });
            }
        }
    );

    // Handle removed tabs
    tabsOnRemoved.addListener((tabId) => {
        logVerbose('tabsOnRemoved', tabId);
        // Remove the current tab id from group tracking regardless
        // of if we are automatically sorting to stay updated
        getMemoryCache().remove(tabId);
        void organizeTabs({});
    });
}
