import { logVerbose } from 'src/logs/console';
import { create as tabsCreate } from 'src/api/browser/tabs/create';
import { MkResource } from './MkResources';
import { createDropdown } from 'src/api/business/contextMenus/createDropdown';
import { MkDropdownItem } from 'src/api/business/contextMenus/MkCreateDropdown';

// External link locations mapped
// by resource identifier
// prettier-ignore
// For long links on one line
const linksByResource = {
    welcome: 'https://docs.google.com/document/d/1m6rxYRJcf8ZzgcSKy94nkO6C4msh6h49lFRi4tHupBg/edit?usp=sharing',
    releaseNotes: 'https://docs.google.com/document/d/1l-W6RTAIdAhlzh-iWi5-w-pYUTfiHGQLAsuSoeb_B8I/edit?usp=sharing',
};

/**
 * Create resources menu with all
 * supported configurations
 */
export function createMenu(): void {
    logVerbose('createMenu');
    const menuItems: MkDropdownItem[] = [];
    menuItems.push({
        format: 'normal',
        identifier: 'welcome',
        title: 'Welcome to Mark',
    });
    menuItems.push({
        format: 'normal',
        identifier: 'releaseNotes',
        title: 'Version release notes',
    });
    void createDropdown({
        heading: 'Resources',
        children: menuItems,
        label: 'resources',
        // Specific to the action context
        // referring the extension icon
        location: 'action',
    });
}

/**
 * Handle resources context menu clicks
 * by redirecting to resource locations
 */
export function handleItemClick(identifier: MkResource): void {
    logVerbose('handleItemClick', identifier);
    // Valid resources get opened
    openLink(identifier);
}

/**
 * Test and type guard menu items to make sure
 * their id is what we expect mapped in state
 */
export function isMenuItemValid(id: unknown): id is MkResource {
    if (typeof id !== 'string') {
        return false;
    }
    const resources = Object.keys(linksByResource);
    return resources.includes(id);
}

/**
 * Open resource link in a new tab
 */
export function openLink(resource: MkResource): void {
    const url = linksByResource[resource];
    const createProperties = { url };
    void tabsCreate(createProperties);
}
