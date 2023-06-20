import { contextMenusOnClicked } from 'src/infra/browser/context-menus/on-clicked';
import { LINKS_BY_RESOURCE } from './resource-constants';
import { Resource } from './resources-types';
import { logVerbose } from 'src/logs/console';
import { openResourcesLink } from './open-resource-link';

/**
 * Test and type guard menu items to make sure
 * their id is what we expect mapped in state
 */
function isResource(id: unknown): id is Resource {
    if (typeof id !== 'string') {
        return false;
    }
    const resources = Object.keys(LINKS_BY_RESOURCE);
    return resources.includes(id);
}

/**
 * Handle selection for a resource
 */
export function handleResourceSelection() {
    // Handle clicks on any context menu item
    contextMenusOnClicked.addListener(({ menuItemId }) => {
        logVerbose('contextMenusOnClicked', menuItemId);
        if (isResource(menuItemId)) {
            openResourcesLink(menuItemId);
        }
    });
}
