import {
    MkAction,
    MkConstructorParams,
    MkCreateCheckboxParams,
    MkHandleToggleParams,
    MkMakeCheckboxPropertiesParams,
} from './MkAction';
import { MkState, MkStore } from 'src/storage/MkStore';
import { MkOrganizer as MkTabsOrganizer } from 'src/tabs/MkOrganizer';
import { MkGrouper as MkTabsGrouper } from 'src/tabs/MkGrouper';
import { browser } from 'src/api/browser';
import { logError, logVerbose } from 'src/logs/console';

/**
 * Action context menu creation
 * and change handling
 */
export class Action implements MkAction {
    public constructor({
        store,
        tabsGrouper,
        tabsOrganizer,
    }: MkConstructorParams) {
        if (!tabsGrouper) {
            throw new Error('No tabsGrouper');
        }
        this.tabsGrouper = tabsGrouper;

        if (!tabsOrganizer) {
            throw new Error('No tabsOrganizer');
        }
        this.tabsOrganizer = tabsOrganizer;

        if (!store) {
            throw new Error('No store');
        }
        this.store = store;

        logVerbose('constructor');
    }

    private readonly store: MkStore;
    private readonly tabsGrouper: MkTabsGrouper;
    private readonly tabsOrganizer: MkTabsOrganizer;

    /**
     * Connect handler for context menu updates
     */
    public connect(): void {
        logVerbose('connect');

        // Only create menus when installed
        browser.runtime.onInstalled.addListener((details) => {
            logVerbose('browser.runtime.onInstalled', details);
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            // We have no shared dependencies
            if (details.reason === 'shared_module_update') {
                return;
            }
            void this.create();
        });

        // Handle clicks on any context menu item
        browser.contextMenus.onClicked.addListener((info, tab) => {
            logVerbose('browser.contextMenus.onClicked', info);
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            this.handleToggle({ info, tab });
        });
    }

    /**
     * Initialize creation of and interaction with all context menus
     */
    private async create(): Promise<void> {
        logVerbose('create');
        // Create the browser action context menu
        // for toggling automatic sorting
        const labelId = 'settings';
        void this.createLabel(labelId);
        const { enableAlphabeticSorting } = await this.store.getState();
        logVerbose('create', enableAlphabeticSorting);
        void this.createCheckbox({
            id: 'enableAlphabeticSorting',
            isChecked: enableAlphabeticSorting,
            parentId: labelId,
            title: 'Sort tabs alphabetically',
        });
        // Create the browser action context menu
        // for toggling automatic grouping
        const isTabGroupingSupported = this.tabsGrouper.isSupported();
        if (isTabGroupingSupported) {
            const { enableAutomaticGrouping } = await this.store.getState();
            logVerbose('create', enableAutomaticGrouping);
            void this.createCheckbox({
                id: 'enableAutomaticGrouping',
                isChecked: enableAutomaticGrouping,
                parentId: labelId,
                title: 'Group tabs automatically',
            });
        }
        // Create the browser action context menu
        // for toggling use of granular domains
        const { enableSubdomainFiltering } = await this.store.getState();
        logVerbose('create', enableSubdomainFiltering);
        void this.createCheckbox({
            id: 'enableSubdomainFiltering',
            isChecked: enableSubdomainFiltering,
            parentId: labelId,
            title: 'Filter tabs by subdomain',
        });
        // Create the browser action context menu
        // for toggling tab group clustering
        const { clusterGroupedTabs } = await this.store.getState();
        logVerbose('create', clusterGroupedTabs);
        void this.createCheckbox({
            id: 'clusterGroupedTabs',
            isChecked: clusterGroupedTabs,
            parentId: labelId,
            title: 'Cluster grouped tabs',
        });
        // Create the browser action context menu
        // for showing the group tab count
        const { showGroupTabCount } = await this.store.getState();
        void this.createCheckbox({
            id: 'showGroupTabCount',
            isChecked: showGroupTabCount,
            parentId: labelId,
            title: 'Show group tab count',
        });
        // Create the browser action context menu
        // for toggling forced window consolidation
        const { forceWindowConsolidation } = await this.store.getState();
        void this.createCheckbox({
            id: 'forceWindowConsolidation',
            isChecked: forceWindowConsolidation,
            parentId: labelId,
            title: 'Force window consolidation',
        });
    }

    /**
     * Create a new checkbox menu item
     */
    private async createCheckbox({
        id,
        isChecked,
        parentId,
        title,
    }: MkCreateCheckboxParams) {
        logVerbose('createCheckbox');
        try {
            const createProperties = this.makeCheckboxProperties({
                checked: isChecked,
                identifier: id,
                labelId: parentId,
                text: title,
            });
            await browser.contextMenus.create(createProperties);
        } catch (error) {
            logError('createCheckbox', error);
            throw error;
        }
    }

    /**
     * Create a new label menu item
     */
    private async createLabel(id: string) {
        logVerbose('createLabel');
        try {
            const createProperties = this.makeLabelProperties(id);
            await browser.contextMenus.create(createProperties);
        } catch (error) {
            logError('createLabel', error);
            throw error;
        }
    }

    /**
     * Handle auto sort context menu setting clicks
     * by updating a temporary internal state only
     */
    private handleToggle({ info }: MkHandleToggleParams) {
        logVerbose('handleToggle', info);
        // Menu item id can be any as described by official typings
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { checked, menuItemId } = info;
        // Various settings changes require reorganization
        void this.tabsOrganizer.organize({
            clean: true,
            type: 'collapse',
        });
        // Remove any existing groups when grouping is disabled
        const isAutomaticGrouping = menuItemId === 'enableAutomaticGrouping';
        if (isAutomaticGrouping && !checked) {
            void this.tabsGrouper.remove();
        }
        const settings: (keyof MkState)[] = [
            'clusterGroupedTabs',
            'enableAutomaticGrouping',
            'enableAlphabeticSorting',
            'enableSubdomainFiltering',
            'forceWindowConsolidation',
            'showGroupTabCount',
        ];
        if (!settings.includes(menuItemId)) {
            // Menu item id can be any but we assume a string for now
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`Invalid settings key: ${menuItemId}`);
        }
        // Rely on the menu item to automatically update itself
        // "menuItemId" is expected to be mapped to settings keys
        // TODO: Typeguard so "menuItemId" is known to be acceptable
        logVerbose('handleToggle', menuItemId);
        const data = { [menuItemId]: checked };
        void this.store.setState(data);
    }

    /**
     * Make properties used for specifying a checkbox to be created
     */
    private makeCheckboxProperties({
        checked,
        identifier,
        labelId,
        text,
    }: MkMakeCheckboxPropertiesParams) {
        logVerbose('makeCheckboxProperties');
        return {
            checked,
            contexts: ['action'],
            id: identifier,
            parentId: labelId,
            title: text,
            type: 'checkbox',
            visible: true,
        };
    }

    /**
     * Make properties used for specifying a label to be created
     */
    private makeLabelProperties(labelId: string) {
        logVerbose('makeLabelProperties');
        return {
            contexts: ['action'],
            id: labelId,
            title: 'Settings',
            visible: true,
        };
    }
}
