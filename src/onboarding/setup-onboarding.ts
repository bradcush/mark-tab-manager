import { logVerbose } from 'src/logs/console';
import { runtimeOnInstalled } from 'src/infra/browser/runtime/on-installed';
import { openResourcesLink } from 'src/toolbar/resources/open-resource-link';
import { organizeTabs } from 'src/tabs/organize-tabs';
import { managementOnEnabled } from 'src/infra/browser/management/on-enabled';
import { runtimeGetId } from 'src/infra/browser/runtime/constants/id';

/**
 * Prepare the extension to open the welcome
 * and sort when installed or enabled
 */
export function setupOnboarding() {
    // Only open the welcome onboarding when installed
    runtimeOnInstalled.addListener((details) => {
        logVerbose('runtimeOnInstalled', details);
        // We have no shared dependencies
        if (details.reason !== 'install') {
            return;
        }
        // Open welcome onboarding
        openResourcesLink('welcome');
    });

    // Organize tabs when the extension is installed
    // and updated or the browser itself is updated
    runtimeOnInstalled.addListener((details) => {
        logVerbose('runtimeOnInstalled', details);
        // We have no shared dependencies
        if (details.reason === 'shared_module_update') {
            return;
        }
        void organizeTabs({
            format: 'collapse',
        });
    });

    // Organize tabs when enabled but previously installed
    managementOnEnabled.addListener((info) => {
        logVerbose('managementOnEnabled', info);
        // We only care about ourselves being enabled
        const isEnabled = info.id === runtimeGetId();
        if (!isEnabled) {
            return;
        }
        void organizeTabs({
            format: 'collapse',
        });
    });
}
