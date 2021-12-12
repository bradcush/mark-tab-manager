import { isGroupChanged, organize } from './organize';
import { logVerbose } from 'src/logs/console';
import { getMemoryCache } from 'src/storage/MemoryCache';
import { onInstalled as runtimeOnInstalled } from 'src/api/browser/runtime/onInstalled';
import { onEnabled as managementOnEnabled } from 'src/api/browser/management/onEnabled';
import { getId as getRuntimeId } from 'src/api/browser/runtime/constants/id';
import { onClicked as actionOnClicked } from 'src/api/browser/action/onClicked';
import { onUpdated as tabsOnUpdated } from 'src/api/browser/tabs/onUpdated';
import { onRemoved as tabsOnRemoved } from 'src/api/browser/tabs/onRemoved';
import { onCommand as commandsOnCommand } from 'src/api/browser/commands/onCommand';

/**
 * Connect site organizer to
 * triggering browser events
 */
export function connect(): void {
    logVerbose('connect');

    // Organize tabs on install and update
    // TODO: Perfect candidate for business API creation
    runtimeOnInstalled.addListener((details) => {
        logVerbose('runtimeOnInstalled', details);
        if (chrome.runtime.lastError) {
            throw chrome.runtime.lastError;
        }
        // We have no shared dependencies
        if (details.reason === 'shared_module_update') {
            return;
        }
        void organize({ type: 'collapse' });
    });

    // Organize tabs when enabled but previously installed
    managementOnEnabled.addListener((info) => {
        logVerbose('managementOnEnabled', info);
        if (chrome.runtime.lastError) {
            throw chrome.runtime.lastError;
        }
        // We only care about ourselves being enabled
        const isEnabled = info.id === getRuntimeId();
        if (!isEnabled) {
            return;
        }
        void organize({ type: 'collapse' });
    });

    // Handle when the extension icon is clicked
    actionOnClicked.addListener(() => {
        logVerbose('actionOnClicked');
        if (chrome.runtime.lastError) {
            throw chrome.runtime.lastError;
        }
        void organize({ type: 'collapse' });
    });

    // Handle tabs where a URL is updated
    tabsOnUpdated.addListener(
        // Handlers can be async since we just care to fire and forget
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (tabId, changeInfo, tab) => {
            // TODO: Move busiess logic into organize domain
            logVerbose('tabsOnUpdated', changeInfo);
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            const { status, url } = changeInfo;
            // Prevent triggering of updates when we aren't loading
            // so we can treat tabs as early as possible
            if (status !== 'loading') {
                return;
            }
            // If there is no url change we don't consider updating its
            // group. (It's observed that only loading tabs can have a url
            // and that reloading a tab doesn't send a url)
            if (!url) {
                return;
            }
            // If the group assignation didn't change
            // then we don't bother to organize
            const isTabGroupChanged = await isGroupChanged({
                id: tabId,
                currentUrl: url,
            });
            if (!isTabGroupChanged) {
                return;
            }
            void organize({ tab });
        }
    );

    // Handle removed tabs
    tabsOnRemoved.addListener((tabId) => {
        logVerbose('tabsOnRemoved', tabId);
        if (chrome.runtime.lastError) {
            throw chrome.runtime.lastError;
        }
        // Remove the current tab id from group tracking regardless
        // of if we are automatically sorting to stay updated
        getMemoryCache().remove(tabId);
        void organize();
    });

    // Handle keyboard shortcuts defined in the manifest
    commandsOnCommand.addListener((command) => {
        logVerbose('commandsOnCommand', command);
        if (command === 'collapse') {
            void organize({ type: 'collapse' });
        }
    });
}
