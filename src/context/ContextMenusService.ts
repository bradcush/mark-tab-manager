import { v4 as uuid } from 'uuid';
import {
    MkCmBrowser,
    MkContextMenusService,
    MkCmHandleToggleParams,
} from './MkContextMenusService';

/**
 * Context menu creation and updating
 * TODO: Make general to handle other checkbox menus
 */
export class ContextMenusService implements MkContextMenusService {
    public constructor(browser: MkCmBrowser) {
        console.log('ContextMenusService.constructor');
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;
    }

    private readonly browser: MkCmBrowser;

    /**
     * Initialize creation of and interaction with all context menus
     */
    public async init() {
        console.log('ContextMenusService.init');

        // Create the browser action context menu
        // for toggling automatic sorting
        const initialState = await this.setInitialState();
        console.log('ContextMenusService.init', initialState);
        const isChecked =
            typeof initialState === 'boolean' ? initialState : true;
        const autoSortCreateProperties = {
            checked: isChecked,
            contexts: ['action'],
            id: uuid(),
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
        });

        // Handle clicks on any context menu item
        this.browser.contextMenus.onClicked.addListener((info, tab) => {
            console.log('ContextMenusService.browser.contextMenus.onClicked');
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
            // The only identifier we have for a given item is the menuItemId
            this.handleToggle({ info, tab });
        });
    }

    /**
     * Handle auto sort context menu setting clicks by
     * updating a temporary internal state only for now
     * TODO: Use local settings persistent storage to
     * replace any type of in memory store
     */
    private handleToggle({ info }: MkCmHandleToggleParams) {
        console.log('ContextMenusService.handleToggle', info);
        // TODO: We might want to consider not storing as separate keys
        const data = { enableAutomaticSorting: info.checked };
        this.browser.storage.sync.set(data, () => {
            console.log('ContextMenusService.browser.storage.sync', data);
            const lastError = this.browser.runtime.lastError;
            if (lastError) {
                throw lastError;
            }
        });
    }

    /**
     * Get the initial state for enableAutomaticSorting
     * from the synced storage of the browser
     */
    private setInitialState() {
        console.log('ContextMenusService.setInitialState');
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
}
