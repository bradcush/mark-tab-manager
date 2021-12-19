import { logVerbose } from 'src/logs/console';
import { makeMenu } from './action';
import { create as tabsCreate } from 'src/api/browser/tabs/create';
import { MkMakeMenuItem } from './MkAction';
import { MkResource } from './MkResources';

// External link locations mapped
// by resource identifier
// prettier-ignore
// For long links on one line
const linksByResource = {
    welcome: 'https://docs.google.com/document/d/1m6rxYRJcf8ZzgcSKy94nkO6C4msh6h49lFRi4tHupBg/edit?usp=sharing',
};

/**
 * Create resources menu with all
 * supported configurations
 */
export function createMenu(): void {
    logVerbose('createMenu');
    const menuItems: MkMakeMenuItem[] = [];
    menuItems.push({
        format: 'normal',
        identifier: 'welcome',
        title: 'Welcome to Mark',
    });
    void makeMenu({
        heading: 'Resources',
        items: menuItems,
        label: 'resources',
    });
}

/**
 * Handle resources context menu clicks
 * by redirecting to resource locations
 */
export function handleItemClick(identifier: unknown): void {
    logVerbose('handleItemClick', identifier);
    if (!isMenuItemValid(identifier)) {
        // Menu item id can be any but we assume a string for now
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Invalid resources key: ${identifier}`);
    }
    const url = linksByResource[identifier];
    const createProperties = { url };
    // Open the URL in a new tab
    void tabsCreate(createProperties);
}

/**
 * Test and type guard menu items to make sure
 * their id is what we expect mapped in state
 */
function isMenuItemValid(id: unknown): id is MkResource {
    if (typeof id !== 'string') {
        return false;
    }
    const resources = Object.keys(linksByResource);
    return resources.includes(id);
}
