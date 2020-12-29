import { v4 as uuid } from 'uuid';
import {
    MkCmBrowser,
    MkContextMenusService,
    MkCmHandleToggleParams,
    MkCmConstructorParams,
    MkCmSetMenuItemParams,
    MkCmCreateMenuItemParams,
} from './MkContextMenusService';
import { MkAddToQueue } from 'src/helpers/MkMakeQueue';

/**
 * Context menu creation and updating
 * TODO: Make general to handle other checkbox menus
 */
export class ContextMenusService implements MkContextMenusService {
    public constructor({ addToQueue, browser }: MkCmConstructorParams) {
        console.log('ContextMenusService.constructor');

        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        if (!addToQueue) {
            throw new Error('No queue');
        }
        this.addToQueue = addToQueue;
    }

    private readonly addToQueue: MkAddToQueue;
    private readonly browser: MkCmBrowser;
    private isCreated: boolean = false;
    private menuItemId: string | null = null;

    /**
     * Initialize creation of and interaction with all context menus
     */
    public async init() {
        console.log('ContextMenusService.init');

        // Create the browser action context menu
        // for toggling automatic sorting
        const initialState = await this.getInitialState();
        console.log('ContextMenusService.init', initialState);
        this.addToQueue((callback) => {
            this.createMenuItem({ initialState, callback });
        });

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
     * Remove an existing menu items and create a
     * new item with the given initial state
     */
    private createMenuItem({
        initialState,
        callback,
    }: MkCmCreateMenuItemParams) {
        console.log('ContextMenusService.createMenuItem', initialState);
        this.browser.contextMenus.removeAll(() => {
            console.log('ContextMenusService.browser.contextMenus.removeAll');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            this.setMenuItem({ isChecked: initialState, callback });
        });
    }

    /**
     * Get the initial state for enableAutomaticSorting
     * from the synced storage of the browser
     */
    private getInitialState() {
        console.log('ContextMenusService.getInitialState');
        return new Promise((resolve) => {
            this.browser.storage.sync.get('enableAutomaticSorting', (items) => {
                console.log('ContextMenusService.browser.storage.sync', items);
                const lastError = this.browser.runtime.lastError;
                if (lastError) {
                    throw lastError;
                }
                resolve(items.enableAutomaticSorting);
            });
        });
    }

    /**
     * Get if a menu item has been created
     */
    private getIsCreated() {
        console.log('ContextMenusService.getIsCreated');
        return this.isCreated;
    }

    /**
     * Get the existing menu item id if it
     * exists or create a new one to be used
     */
    private getMenuItemId() {
        console.log('ContextMenusService.getMenuItemId');
        if (!this.menuItemId) {
            const id = uuid();
            this.menuItemId = id;
            return id;
        }
        return this.menuItemId;
    }

    /**
     * Handle auto sort context menu setting clicks by
     * updating a temporary internal state only for now
     * TODO: Use local settings persistent storage to
     * replace any type of in memory store
     */
    private handleToggle({ info }: MkCmHandleToggleParams) {
        console.log('ContextMenusService.handleToggle', info);
        const { checked } = info;
        // In the case when the service worker starts the menu item is removed
        // and recreated after the item has been clicked, we require a manual
        // update to reflect the proper visual state in the menu.
        const isCreated = this.getIsCreated();
        if (!isCreated) {
            this.addToQueue((callback) => {
                this.createMenuItem({ initialState: checked, callback });
            });
        }
        // No need to wait for menu creation before storing the setting
        const data = { enableAutomaticSorting: checked };
        this.browser.storage.sync.set(data, () => {
            console.log('ContextMenusService.browser.storage.sync.set', data);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
        });
    }

    /**
     * Set whether a menu item has been created
     */
    private setIsCreated(isCreated: boolean) {
        console.log('ContextMenusService.setIsCreated');
        this.isCreated = isCreated;
    }

    /**
     * Create or update a menu item
     */
    private setMenuItem({ isChecked, callback }: MkCmSetMenuItemParams) {
        console.log('ContextMenusService.setMenuItem');
        const checked = typeof isChecked === 'boolean' ? isChecked : true;
        const id = this.getMenuItemId();
        console.log('ContextMenusService.setMenuItem', id);
        const autoSortCreateProperties = {
            checked,
            contexts: ['action'],
            id,
            title: 'Enable automatic sorting',
            type: 'checkbox',
            visible: true,
        };
        this.browser.contextMenus.create(autoSortCreateProperties, () => {
            console.log('ContextMenusService.browser.contextMenus.create');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            this.setIsCreated(true);
            callback();
        });
    }
}
