import { MkToggleParams } from './MkSettings';
import { MkStateKey } from 'src/storage/MkStore';
import { logVerbose } from 'src/logs/console';
import { getStore } from 'src/storage/Store';
import { makeMenu } from './action';
import { MkMakeMenuItem } from './MkAction';
import { organize } from 'src/tabs/organize';
import {
    isSupported as isTabGroupingSupported,
    remove as removeGroups,
} from 'src/tabs/group';

/**
 * Create settings menu with all
 * supported configurations
 */
export async function create(): Promise<void> {
    logVerbose('create');

    const {
        clusterGroupedTabs,
        enableAutomaticGrouping,
        enableAlphabeticSorting,
        enableSubdomainFiltering,
        forceWindowConsolidation,
        showGroupTabCount,
    } = await getStore().getState();

    const menuItems: MkMakeMenuItem[] = [];
    // Create the browser action context menu
    // for toggling automatic sorting
    logVerbose('create', enableAlphabeticSorting);
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
        identifier: 'forceWindowConsolidation',
        isChecked: forceWindowConsolidation,
        title: 'Force window consolidation',
    });

    void makeMenu({
        heading: 'Settings',
        items: menuItems,
        label: 'settings',
    });
}

/**
 * Test and type guard menu items to make sure
 * their id is what we expect mapped in state
 */
function isMenuItemValid(id: unknown): id is MkStateKey {
    if (typeof id !== 'string') {
        return false;
    }
    // TODO: Maybe this should come from the store
    const settings = [
        'clusterGroupedTabs',
        'enableAutomaticGrouping',
        'enableAlphabeticSorting',
        'enableSubdomainFiltering',
        'forceWindowConsolidation',
        'showGroupTabCount',
    ];
    return settings.includes(id);
}

/**
 * Handle auto sort context menu setting clicks
 * by updating a temporary internal state only
 */
export function toggle({ identifier, isChecked }: MkToggleParams): void {
    logVerbose('toggle', identifier);
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
        void removeGroups();
    }
    if (!isMenuItemValid(identifier)) {
        // Menu item id can be any but we assume a string for now
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Invalid settings key: ${identifier}`);
    }
    // Rely on the menu item to automatically update itself
    // identifier is expected to be mapped to settings keys
    logVerbose('toggle', identifier);
    const data = { [identifier]: isChecked };
    void getStore().setState(data);
}
