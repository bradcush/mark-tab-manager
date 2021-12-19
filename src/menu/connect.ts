import { logVerbose } from 'src/logs/console';
import { onInstalled as runtimeOnInstalled } from 'src/api/browser/runtime/onInstalled';
import { onClicked as contextMenusOnClicked } from 'src/api/browser/contextMenus/onClicked';
import {
    createMenu as createResourcesMenu,
    handleItemClick as handleResourcesItemClick,
    isMenuItemValid as isResourcesMenuItem,
    openLink as openResourcesLink,
} from './resources';
import {
    createMenu as createSettingsMenu,
    handleItemClick as handleSettingsItemClick,
    isMenuItemValid as isSettingsMenuItem,
} from './settings';

/**
 * Handle driven context menu
 * updates from the browser
 */
export function connect(): void {
    logVerbose('connect');

    // Only create menus when the extension is installed
    // and updated or the browser itself is updated
    runtimeOnInstalled.addListener((details) => {
        logVerbose('runtimeOnInstalled', details);
        // We have no shared dependencies
        if (details.reason === 'shared_module_update') {
            return;
        }
        void createResourcesMenu();
        void createSettingsMenu();
    });

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

    // Handle clicks on any context menu item
    contextMenusOnClicked.addListener(({ checked, menuItemId }) => {
        logVerbose('contextMenusOnClicked', menuItemId);
        // We only want to handle settings
        if (isSettingsMenuItem(menuItemId)) {
            handleSettingsItemClick({
                identifier: menuItemId,
                isChecked: checked,
            });
        }
        // We only want to handle resources
        if (isResourcesMenuItem(menuItemId)) {
            handleResourcesItemClick(menuItemId);
        }
    });
}
