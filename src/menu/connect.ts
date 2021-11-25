import { logVerbose } from 'src/logs/console';
import { MkConnectParams } from './MkConnect';
import { onInstalled as runtimeOnInstalled } from 'src/api/browser/runtime/onInstalled';
import { onClicked as contextMenusOnClicked } from 'src/api/browser/contextMenus/onClicked';

/**
 * Handle driven context menu
 * updates from the browser
 */
export function connect({ create, toggle }: MkConnectParams): void {
    logVerbose('connect');

    // Only create menus when installed
    runtimeOnInstalled.addListener((details) => {
        logVerbose('browser.runtime.onInstalled', details);
        if (chrome.runtime.lastError) {
            throw chrome.runtime.lastError;
        }
        // We have no shared dependencies
        if (details.reason === 'shared_module_update') {
            return;
        }
        void create();
    });

    // Handle clicks on any context menu item
    contextMenusOnClicked.addListener(({ checked, menuItemId }) => {
        logVerbose('browser.contextMenus.onClicked', menuItemId);
        if (chrome.runtime.lastError) {
            throw chrome.runtime.lastError;
        }
        toggle({
            identifier: menuItemId,
            isChecked: checked,
        });
    });
}
