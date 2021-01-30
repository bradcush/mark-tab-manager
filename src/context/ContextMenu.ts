import { v4 as uuid } from 'uuid';
import {
    MkConstructorParams,
    MkContextMenu,
    MkContextMenuBrowser,
    MkHandleToggleParams,
} from './MkContextMenu';
import { MkStore } from 'src/storage/MkStore';

/**
 * Context menu creation and updating
 */
export class ContextMenu implements MkContextMenu {
    public constructor({ browser, store }: MkConstructorParams) {
        console.log('ContextMenu.constructor');

        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        if (!store) {
            throw new Error('No store');
        }
        this.store = store;
    }

    private readonly browser: MkContextMenuBrowser;
    private readonly store: MkStore;

    /**
     * Initialize creation of and interaction with all context menus
     */
    public create(): void {
        console.log('ContextMenu.init');

        // Create the browser action context menu
        // for toggling automatic sorting
        const { enableAutomaticSorting } = this.store.getState();
        console.log('ContextMenu.init', enableAutomaticSorting);
        this.replaceMenuItem(enableAutomaticSorting);

        // Handle clicks on any context menu item
        this.browser.contextMenus.onClicked.addListener((info, tab) => {
            console.log('ContextMenu.browser.contextMenus.onClicked');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            this.handleToggle({ info, tab });
        });
    }

    /**
     * Create a new menu item
     */
    private createMenuItem(isChecked: boolean) {
        console.log('ContextMenu.createMenuItem');
        const autoSortCreateProperties = this.makeCreateProperties(isChecked);
        this.browser.contextMenus.create(autoSortCreateProperties, () => {
            console.log('ContextMenu.browser.contextMenus.create');
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
        console.log('ContextMenu.handleToggle', info);
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
        console.log('ContextMenu.replaceMenuItem', checked);
        // TODO; Remove only the specific menu item or
        // don't remove at all if you don't need to
        this.browser.contextMenus.removeAll(() => {
            console.log('ContextMenu.browser.contextMenus.removeAll');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            this.createMenuItem(checked);
        });
    }
}
