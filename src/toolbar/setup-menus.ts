import { logVerbose } from 'src/logs/console';
import { createSettingsMenu } from './settings/create-settings-menu';
import { createResourcesMenu } from './resources/create-resources-menu';
import { contextMenusRemoveAll } from 'src/infra/browser/context-menus/remove-all';
import { runtimeOnInstalled } from 'src/infra/browser/runtime/on-installed';
import { runtimeOnStartup } from 'src/infra/browser/runtime/on-startup';
import { listenForSettingsChange } from './settings/change-settings';
import { handleResourceSelection } from './resources/handle-resource-selection';

/**
 * Create all context menus after first
 * removing any pre-existing menus
 */
async function createMenus() {
    logVerbose('createMenus');
    // Sometimes menus aren't destroyed properly and
    // we have id conflicts when creating new ones
    await contextMenusRemoveAll();
    void createSettingsMenu();
    void createResourcesMenu();
}

/**
 * Setup menus by attaching to extension install, extension
 * update, browser install, and browser startup. This will likely
 * conflict in cases where the browser updates and starts.
 */
export function setupMenus(): void {
    logVerbose('setupMenus');

    // Listeners need to be registered on
    // the first turn of the event loop
    listenForSettingsChange();
    handleResourceSelection();

    // Only create menus when the extension is installed
    // and updated or the browser itself is updated
    runtimeOnInstalled.addListener((details) => {
        logVerbose('runtimeOnInstalled', details);
        // We have no shared dependencies
        if (details.reason === 'shared_module_update') {
            return;
        }
        void createMenus();
    });

    // When the profile starts up which is a good proxy for
    // when the extension starts after a browser restart
    runtimeOnStartup.addListener(() => {
        logVerbose('runtimeOnStartup');
        void createMenus();
    });
}
