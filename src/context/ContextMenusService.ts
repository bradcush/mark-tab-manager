import { v4 as uuid } from 'uuid';
import {
    MkCmBrowser,
    MkCmConstructorParams,
    MkCmHandleToggleParams,
    MkContextMenusService,
} from './MkContextMenusService';
import { MkStore } from 'src/storage/MkStore';

/**
 * Context menu creation and updating
 * TODO: Make general to handle other checkbox menus
 */
export class ContextMenusService implements MkContextMenusService {
    public constructor({ browser, storage }: MkCmConstructorParams) {
        console.log('ContextMenusService.constructor');

        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        if (!storage) {
            throw new Error('No storage');
        }
        this.storage = storage;
    }

    private readonly browser: MkCmBrowser;
    private readonly storage: MkStore;

    /**
     * Initialize creation of and interaction with all context menus
     */
    public init(): void {
        console.log('ContextMenusService.init');

        // Create the browser action context menu
        // for toggling automatic sorting
        const { enableAutomaticSorting } = this.storage.getState();
        console.log('ContextMenusService.init', enableAutomaticSorting);
        this.replaceMenuItem(enableAutomaticSorting);

        // Handle clicks on any context menu item
        this.browser.contextMenus.onClicked.addListener((info, tab) => {
            console.log('ContextMenusService.browser.contextMenus.onClicked');
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
        console.log('ContextMenusService.createMenuItem');
        const autoSortCreateProperties = this.makeCreateProperties(isChecked);
        this.browser.contextMenus.create(autoSortCreateProperties, () => {
            console.log('ContextMenusService.browser.contextMenus.create');
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
    private handleToggle({ info }: MkCmHandleToggleParams) {
        console.log('ContextMenusService.handleToggle', info);
        const { checked } = info;
        // Rely on the menu item to automatically update itself
        // TODO: Remove specific reference to this particular setting
        const data = { enableAutomaticSorting: checked };
        void this.storage.setState(data);
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
        console.log('ContextMenusService.replaceMenuItem', checked);
        // TODO; Remove only the specific menu item or
        // don't remove at all if you don't need to
        this.browser.contextMenus.removeAll(() => {
            console.log('ContextMenusService.browser.contextMenus.removeAll');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            this.createMenuItem(checked);
        });
    }
}
