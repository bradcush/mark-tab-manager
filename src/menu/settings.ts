import { MkToggleParams } from './MkSettings';
import { MkStateKey } from 'src/storage/MkStore';
import { logVerbose } from 'src/logs/console';
import { getStore } from 'src/storage/Store';
import { organize } from 'src/tabs/organize';
import { isSupported as isTabGroupingSupported } from 'src/api/browser/tabGroups/isSupported';
import { ungroup as ungroupTabs } from 'src/tabs/bar';
import { MkDropdownItem } from 'src/api/business/contextMenus/MkCreateDropdown';
import { createDropdown } from 'src/api/business/contextMenus/createDropdown';

/**
 * Create settings menu with all
 * supported configurations
 */
export async function createMenu(): Promise<void> {
    logVerbose('createMenu');
    const {
        clusterGroupedTabs,
        enableAutomaticGrouping,
        enableAlphabeticSorting,
        enableSubdomainFiltering,
        forceWindowConsolidation,
        showGroupTabCount,
        suspendCollapsedGroups,
    } = await getStore().getState();
    const menuItems: MkDropdownItem[] = [];
    // Create the browser action context menu
    // for toggling automatic sorting
    logVerbose('createMenu', enableAlphabeticSorting);
    menuItems.push({
        format: 'checkbox',
        identifier: 'enableAlphabeticSorting',
        isChecked: enableAlphabeticSorting,
        title: 'Sort tabs alphabetically',
    });
    // Some browser versions don't support grouping
    if (isTabGroupingSupported()) {
        logVerbose('create', enableAutomaticGrouping);
        menuItems.push({
            format: 'checkbox',
            identifier: 'enableAutomaticGrouping',
            isChecked: enableAutomaticGrouping,
            title: 'Group tabs automatically',
        });
    }
    menuItems.push({
        format: 'checkbox',
        identifier: 'enableSubdomainFiltering',
        isChecked: enableSubdomainFiltering,
        title: 'Filter tabs by subdomain',
    });
    menuItems.push({
        format: 'checkbox',
        identifier: 'clusterGroupedTabs',
        isChecked: clusterGroupedTabs,
        title: 'Cluster grouped tabs',
    });
    menuItems.push({
        format: 'checkbox',
        identifier: 'showGroupTabCount',
        isChecked: showGroupTabCount,
        title: 'Show group tab count',
    });
    menuItems.push({
        format: 'checkbox',
        identifier: 'suspendCollapsedGroups',
        isChecked: suspendCollapsedGroups,
        title: 'Suspend collapsed groups',
    });
    menuItems.push({
        format: 'checkbox',
        identifier: 'forceWindowConsolidation',
        isChecked: forceWindowConsolidation,
        title: 'Force window consolidation',
    });
    void createDropdown({
        heading: 'Settings',
        children: menuItems,
        label: 'settings',
        // Specific to the action context
        // referring the extension icon
        location: 'action',
    });
}

/**
 * Test and type guard menu items to make sure
 * their id is what we expect mapped in state
 */
export function isMenuItemValid(id: unknown): id is MkStateKey {
    if (typeof id !== 'string') {
        return false;
    }
    const settings = [
        'clusterGroupedTabs',
        'enableAutomaticGrouping',
        'enableAlphabeticSorting',
        'enableSubdomainFiltering',
        'forceWindowConsolidation',
        'showGroupTabCount',
        'suspendCollapsedGroups',
    ];
    return settings.includes(id);
}

/**
 * Handle auto sort context menu setting clicks
 * by updating a temporary internal state only
 */
export function handleItemClick({
    identifier,
    isChecked,
}: MkToggleParams): void {
    logVerbose('handleItemClick', identifier);
    // Menu item id can be any as described by official typings
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // Various settings changes require reorganization
    void organize({
        clean: true,
        type: 'collapse',
    });
    // Remove any existing groups when grouping is disabled
    const isAutomaticGrouping = identifier === 'enableAutomaticGrouping';
    if (isAutomaticGrouping && !isChecked) {
        void ungroupTabs();
    }
    // Rely on the menu item to automatically update itself
    // identifier is expected to be mapped to settings keys
    logVerbose('handleItemClick', identifier);
    const data = { [identifier]: isChecked };
    void getStore().setState(data);
}
