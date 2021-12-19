import { logVerbose } from 'src/logs/console';
import { onInstalled as runtimeOnInstalled } from 'src/api/browser/runtime/onInstalled';
import { onClicked as contextMenusOnClicked } from 'src/api/browser/contextMenus/onClicked';
import {
    createMenu as createResourcesMenu,
    handleItemClick as handleResourcesItemClick,
} from './resources';
import { createMenu as createSettingsMenu, toggle } from './settings';

/**
 * Handle driven context menu
 * updates from the browser
 */
export function connect(): void {
    logVerbose('connect');

    // Only create menus when installed
    runtimeOnInstalled.addListener((details) => {
        logVerbose('runtimeOnInstalled', details);
        // We have no shared dependencies
        if (details.reason === 'shared_module_update') {
            return;
        }
        void createResourcesMenu();
        void createSettingsMenu();
    });

    // Handle clicks on any context menu item
    contextMenusOnClicked.addListener(({ checked, menuItemId }) => {
        logVerbose('contextMenusOnClicked', menuItemId);
        // Allowing individual item click handlers to decide
        // whether or not they should actually take action
        handleResourcesItemClick(menuItemId);
        toggle({
            identifier: menuItemId,
            isChecked: checked,
        });
    });
}
