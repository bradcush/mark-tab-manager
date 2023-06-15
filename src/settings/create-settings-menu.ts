import { logVerbose } from 'src/logs/console';
import { getPersistedStore } from 'src/storage/persisted-store-instance';
import { Checkbox } from './settings-types';
import { isTabGroupingSupported } from 'src/infra/browser/tab-groups/is-supported';
import { runtimeOnInstalled } from 'src/infra/browser/runtime/on-installed';
import { contextMenusCreateLeveled } from 'src/infra/business/context-menus/create-leveled';

/**
 * Create settings menu with all
 * supported configurations
 */
async function createMenuItems() {
    logVerbose('createMenu');
    const {
        clusterGroupedTabs,
        enableAutomaticGrouping,
        enableAlphabeticSorting,
        enableSubdomainFiltering,
        forceWindowConsolidation,
        showGroupTabCount,
        suspendCollapsedGroups,
    } = await getPersistedStore().getState();
    const menuItems: Checkbox[] = [];
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
    return menuItems;
}

/**
 * Create entire settings menu
 */
export function createSettingsMenu() {
    // Only create menus when the extension is installed
    // and updated or the browser itself is updated
    // Handlers can be async since we just care to fire and forget
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    runtimeOnInstalled.addListener(async (details) => {
        logVerbose('runtimeOnInstalled', details);
        // We have no shared dependencies
        if (details.reason === 'shared_module_update') {
            return;
        }
        const menuItems = await createMenuItems();
        void contextMenusCreateLeveled(
            'Settings',
            menuItems,
            'settings',
            'action'
        );
    });
}
