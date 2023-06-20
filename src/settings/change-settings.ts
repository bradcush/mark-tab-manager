import { StateKey } from 'src/storage/persisted-store-types';
import { ToggleParams } from './settings-types';
import { logVerbose } from 'src/logs/console';
import { organizeTabs } from 'src/tabs/organize-tabs';
import { tabsUngroupAll } from 'src/infra/business/tabs/ungroup-all';
import { getPersistedStore } from 'src/storage/persisted-store-instance';
import { contextMenusOnClicked } from 'src/infra/browser/context-menus/on-clicked';

/**
 * Test and type guard menu items to make sure
 * their id is what we expect mapped in state
 */
function isSetting(id: unknown): id is StateKey {
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
function handleItemClick({ identifier, isChecked }: ToggleParams): void {
    logVerbose('handleItemClick', identifier);
    // Menu item id can be any as described by official typings
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // Various settings changes require reorganization
    void organizeTabs({
        clean: true,
        format: 'collapse',
    });
    // Remove any existing groups when grouping is disabled
    const isAutomaticGrouping = identifier === 'enableAutomaticGrouping';
    if (isAutomaticGrouping && !isChecked) {
        void tabsUngroupAll();
    }
    // Rely on the menu item to automatically update itself
    // identifier is expected to be mapped to settings keys
    logVerbose('handleItemClick', identifier);
    const data = { [identifier]: isChecked };
    void getPersistedStore().setState(data);
}

/**
 * Setup listeners to handle settings changes
 */
export function listenForSettingsChange() {
    // Handle clicks on any context menu item
    contextMenusOnClicked.addListener(({ checked, menuItemId }) => {
        logVerbose('contextMenusOnClicked', menuItemId);
        if (isSetting(menuItemId)) {
            handleItemClick({
                identifier: menuItemId,
                isChecked: checked,
            });
        }
    });
}
