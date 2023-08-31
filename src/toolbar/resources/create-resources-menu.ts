import { logVerbose } from 'src/logs/console';
import { Link } from './resources-types';
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
    logVerbose('createResourcesMenu');
    const menuItems = createMenuItems();
    const resourceTitle = 'Resources';
    void contextMenusCreateLeveled(
        resourceTitle,
        menuItems,
        'resources',
        'action',
    );
}
