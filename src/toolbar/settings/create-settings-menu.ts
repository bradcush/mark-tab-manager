import { logVerbose } from 'src/logs/console';
import { getPersistedStore } from 'src/storage/persisted-store-instance';
import { Checkbox } from './settings-types';
import { isTabGroupingSupported } from 'src/infra/browser/tab-groups/is-supported';
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
export async function createSettingsMenu(): Promise<void> {
    logVerbose('createSettingsMenu');
    const menuItems = await createMenuItems();
    const settingsTitle = 'Settings';
    void contextMenusCreateLeveled(
        settingsTitle,
        menuItems,
        'settings',
        'action',
    );
}
