import { v4 as uuid } from 'uuid';
import {
    MkConstructorParams,
    MkCreateCheckboxParams,
    MkHandleToggleParams,
    MkMakeCheckboxPropertiesParams,
    MkMenu,
    MkMenuBrowser,
} from './MkMenu';
import { MkStore } from 'src/storage/MkStore';
import { MkLogger } from 'src/logs/MkLogger';
import { MkOrganizer as MkTabsOrganizer } from 'src/tabs/MkOrganizer';

/**
 * Context menu creation and change handling
 */
export class Menu implements MkMenu {
    public constructor({
        browser,
        store,
        tabsOrganizer,
        Logger,
    }: MkConstructorParams) {
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

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
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            // We have no shared dependencies
            if (details.reason === 'shared_module_update') {
                return;
            }
            void this.create();
        });

        // Handle clicks on any context menu item
        this.browser.contextMenus.onClicked.addListener((info, tab) => {
            this.logger.log('browser.contextMenus.onClicked');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
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
        const { enableAutomaticSorting } = await this.store.getState();
        this.logger.log('create', enableAutomaticSorting);
        const labelId = uuid();
        this.createLabel(labelId);
        this.createCheckbox({
            isChecked: enableAutomaticSorting,
            parentId: labelId,
        });
    }

    /**
     * Create a new checkbox menu item
     */
    private createCheckbox({ isChecked, parentId }: MkCreateCheckboxParams) {
        this.logger.log('createCheckbox');
        const createProperties = this.makeCheckboxProperties({
            checked: isChecked,
            labelId: parentId,
        });
        this.browser.contextMenus.create(createProperties, () => {
            this.logger.log('browser.contextMenus.create');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
        });
    }

    /**
     * Create a new label menu item
     */
    private createLabel(id: string) {
        this.logger.log('createLabel');
        const createProperties = this.makeLabelProperties(id);
        this.browser.contextMenus.create(createProperties, () => {
            this.logger.log('browser.contextMenus.create');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
        });
    }

    /**
     * Handle auto sort context menu setting clicks
     * by updating a temporary internal state only
     */
    private handleToggle({ info }: MkHandleToggleParams) {
        this.logger.log('handleToggle', info);
        const { checked } = info;
        // Automatically organize as soon
        // as the setting is checked
        if (checked) {
            this.tabsOrganizer.organize();
        }
        // Rely on the menu item to automatically update itself
        // TODO: Remove specific reference to this particular setting
        const data = { enableAutomaticSorting: checked };
        void this.store.setState(data);
    }

    /**
     * Make properties used for specifying a checkbox to be created
     */
    private makeCheckboxProperties({
        checked,
        labelId,
    }: MkMakeCheckboxPropertiesParams) {
        this.logger.log('makeCheckboxProperties');
        return {
            checked,
            contexts: ['action'],
            id: uuid(),
            parentId: labelId,
            title: 'Enable automatic sorting',
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
