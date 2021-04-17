import {
    MkConstructorParams,
    MkCreateCheckboxParams,
    MkHandleToggleParams,
    MkMakeCheckboxPropertiesParams,
    MkMenu,
    MkMenuBrowser,
} from './MkMenu';
import { MkState, MkStore } from 'src/storage/MkStore';
import { MkLogger } from 'src/logs/MkLogger';
import { MkOrganizer as MkTabsOrganizer } from 'src/tabs/MkOrganizer';
import { MkGrouper as MkTabsGrouper } from 'src/tabs/MkGrouper';

/**
 * Context menu creation and change handling
 */
export class Menu implements MkMenu {
    public constructor({
        browser,
        store,
        tabsGrouper,
        tabsOrganizer,
        Logger,
    }: MkConstructorParams) {
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

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

        if (!Logger) {
            throw new Error('No Logger');
        }
        this.logger = new Logger('context/Menu');
        this.logger.log('constructor');
    }

    private readonly browser: MkMenuBrowser;
    private readonly tabsGrouper: MkTabsGrouper;
    private readonly tabsOrganizer: MkTabsOrganizer;
    private readonly store: MkStore;
    private readonly logger: MkLogger;

    /**
     * Connect handler for context menu updates
     */
    public connect(): void {
        this.logger.log('connect');

        // Only create menus when installed
        this.browser.runtime.onInstalled.addListener((details) => {
            this.logger.log('browser.runtime.onInstalled', details);
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
        this.browser.contextMenus.onClicked.addListener((info, tab) => {
            this.logger.log('browser.contextMenus.onClicked', info);
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
        this.logger.log('create');
        // Create the browser action context menu
        // for toggling automatic sorting
        const labelId = 'settings';
        void this.createLabel(labelId);
        const { enableAutomaticSorting } = await this.store.getState();
        this.logger.log('create', enableAutomaticSorting);
        void this.createCheckbox({
            id: 'enableAutomaticSorting',
            isChecked: enableAutomaticSorting,
            parentId: labelId,
            title: 'Enable automatic sorting',
        });
        // Create the browser action context menu
        // for toggling automatic grouping
        const isTabGroupingSupported = this.tabsOrganizer.isTabGroupingSupported();
        if (isTabGroupingSupported) {
            const { enableAutomaticGrouping } = await this.store.getState();
            this.logger.log('create', enableAutomaticGrouping);
            void this.createCheckbox({
                id: 'enableAutomaticGrouping',
                isChecked: enableAutomaticGrouping,
                parentId: labelId,
                title: 'Enable automatic grouping',
            });
        }
        // Create the browser action context menu
        // for toggling use of granular domains
        const { enableSubdomainFiltering } = await this.store.getState();
        this.logger.log('create', enableSubdomainFiltering);
        void this.createCheckbox({
            id: 'enableSubdomainFiltering',
            isChecked: enableSubdomainFiltering,
            parentId: labelId,
            title: 'Enable subdomain filtering',
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
        this.logger.log('createCheckbox');
        try {
            const createProperties = this.makeCheckboxProperties({
                checked: isChecked,
                identifier: id,
                labelId: parentId,
                text: title,
            });
            await this.browser.contextMenus.create(createProperties);
        } catch (error) {
            this.logger.error('createCheckbox', error);
            throw error;
        }
    }

    /**
     * Create a new label menu item
     */
    private async createLabel(id: string) {
        this.logger.log('createLabel');
        try {
            const createProperties = this.makeLabelProperties(id);
            await this.browser.contextMenus.create(createProperties);
        } catch (error) {
            this.logger.error('createLabel', error);
            throw error;
        }
    }

    /**
     * Handle auto sort context menu setting clicks
     * by updating a temporary internal state only
     */
    private handleToggle({ info }: MkHandleToggleParams) {
        this.logger.log('handleToggle', info);
        const { checked, menuItemId } = info;
        // Automatically organize as soon as any setting is checked which is
        // opinionated as it relies checked settings meaning enabled.
        // Additionally granularity changes need reorganization
        const isSubdomainFiltering = 'enableSubdomainFiltering' === menuItemId;
        // TODO: Simpler logic could be to reorganize on any change
        if (checked || isSubdomainFiltering) {
            void this.tabsOrganizer.organize({ type: 'collapse' });
        }
        // Remove any existing groups when grouping is disabled
        const isAutomaticGrouping = menuItemId === 'enableAutomaticGrouping';
        if (isAutomaticGrouping && !checked) {
            void this.tabsGrouper.removeAllGroups();
        }
        const settings: (keyof MkState)[] = [
            'enableAutomaticGrouping',
            'enableAutomaticSorting',
            'enableSubdomainFiltering',
            'forceWindowConsolidation',
        ];
        if (!settings.includes(menuItemId)) {
            /* eslint-disable @typescript-eslint/restrict-template-expressions */
            throw new Error(`Invalid settings key: ${menuItemId}`);
        }
        // Rely on the menu item to automatically update itself
        // "menuItemId" is expected to be mapped to settings keys
        // TODO: Typeguard so "menuItemId" is known to be acceptable
        this.logger.log('handleToggle', menuItemId);
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
        this.logger.log('makeCheckboxProperties');
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
        this.logger.log('makeLabelProperties');
        return {
            contexts: ['action'],
            id: labelId,
            title: 'Settings',
            visible: true,
        };
    }
}
