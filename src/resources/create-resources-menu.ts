import { logVerbose } from 'src/logs/console';
import { Link } from './resources-types';
import { runtimeOnInstalled } from 'src/infra/browser/runtime/on-installed';
import { contextMenusCreateLeveled } from 'src/infra/business/context-menus/create-leveled';

/**
 * Create resources menu with all
 * supported configurations
 */
function createMenuItems() {
    logVerbose('createMenu');
    const menuItems: Link[] = [];
    menuItems.push({
        format: 'normal',
        identifier: 'welcome',
        title: 'Welcome to Mark',
    });
    menuItems.push({
        format: 'normal',
        identifier: 'understanding',
        title: 'Understanding Mark',
    });
    menuItems.push({
        format: 'normal',
        identifier: 'releaseNotes',
        title: 'Version release notes',
    });
    return menuItems;
}

/**
 * Create entire resource menu
 */
export function createResourcesMenu(): void {
    // Only create menus when the extension is installed
    // and updated or the browser itself is updated
    runtimeOnInstalled.addListener((details) => {
        logVerbose('runtimeOnInstalled', details);
        // We have no shared dependencies
        if (details.reason === 'shared_module_update') {
            return;
        }
        const menuItems = createMenuItems();
        void contextMenusCreateLeveled(
            'Resources',
            menuItems,
            'resources',
            'action'
        );
    });
}
