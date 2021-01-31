import { v4 as uuid } from 'uuid';
import {
    MkConstructorParams,
    MkContextMenu,
    MkContextMenuBrowser,
    MkHandleToggleParams,
} from './MkContextMenu';
import { MkStore } from 'src/storage/MkStore';
import { MkLogger } from 'src/logs/MkLogger';

/**
 * Context menu creation and updating
 */
export class ContextMenu implements MkContextMenu {
    public constructor({ browser, store, Logger }: MkConstructorParams) {
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        if (!store) {
            throw new Error('No store');
        }
        this.store = store;

        if (!Logger) {
            throw new Error('No Logger');
        }
        this.logger = new Logger('ContextMenu');
        this.logger.log('constructor');
    }

    private readonly browser: MkContextMenuBrowser;
    private readonly store: MkStore;
    private readonly logger: MkLogger;

    /**
     * Connect handler for context menu updates
     */
    public connect(): void {
        this.logger.log('connect');

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
    public async create(): Promise<void> {
        this.logger.log('create');

        // Create the browser action context menu
        // for toggling automatic sorting
        const { enableAutomaticSorting } = await this.store.getState();
        this.logger.log('create', enableAutomaticSorting);
        this.replaceMenuItem(enableAutomaticSorting);
    }

    /**
     * Create a new menu item
     */
    private createMenuItem(isChecked: boolean) {
        this.logger.log('createMenuItem');
        const autoSortCreateProperties = this.makeCreateProperties(isChecked);
        this.browser.contextMenus.create(autoSortCreateProperties, () => {
            this.logger.log('browser.contextMenus.create');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
        });
    }

    /**
     * Handle auto sort context menu setting clicks by
     * updating a temporary internal state only for now
     */
    private handleToggle({ info }: MkHandleToggleParams) {
        this.logger.log('handleToggle', info);
        const { checked } = info;
        // Rely on the menu item to automatically update itself
        // TODO: Remove specific reference to this particular setting
        const data = { enableAutomaticSorting: checked };
        void this.store.setState(data);
    }

    /**
     * Make properties used for specifying a created menu item
     */
    private makeCreateProperties(checked: boolean) {
        this.logger.log('makeCreateProperties');
        return {
            checked,
            contexts: ['action'],
            id: uuid(),
            title: 'Enable automatic sorting',
            type: 'checkbox',
            visible: true,
        };
    }

    /**
     * Remove an existing menu items and create a
     * new item with the given initial state
     */
    private replaceMenuItem(checked: boolean) {
        this.logger.log('replaceMenuItem', checked);
        // TODO; Remove only the specific menu item or
        // don't remove at all if you don't need to
        this.browser.contextMenus.removeAll(() => {
            this.logger.log('browser.contextMenus.removeAll');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            this.createMenuItem(checked);
        });
    }
}
