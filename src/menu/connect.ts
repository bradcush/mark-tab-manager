import { logVerbose } from 'src/logs/console';
import { onInstalled as runtimeOnInstalled } from 'src/api/browser/runtime/onInstalled';
import { onClicked as contextMenusOnClicked } from 'src/api/browser/contextMenus/onClicked';
import { create, toggle } from './settings';

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
        void create();
    });

    // Handle clicks on any context menu item
    contextMenusOnClicked.addListener(({ checked, menuItemId }) => {
        logVerbose('contextMenusOnClicked', menuItemId);
        toggle({
            identifier: menuItemId,
            isChecked: checked,
        });
    });
}
