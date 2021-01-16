import { MkStorageService, MkSsBrowser, MkSsState } from './MkStorageService';

/**
 * Loading, caching, and setting storage
 */
export class StorageService implements MkStorageService {
    public constructor(browser: MkSsBrowser) {
        console.log('StorageService.constructor');
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        // Set defaults to be overridden
        this.state = this.makeDefaultState();
    }

    private readonly browser: MkSsBrowser;
    private state: MkSsState;

    /**
     * Load existing sync storage into memory cache
     * and provide defaults for what hasn't been set
     */
    public async init() {
        console.log('StorageService.init');
        await this.cacheStorage();
    }

    /**
     * Fetch valid storage values and set
     * appropriate values in memory for access
     */
    private async cacheStorage() {
        console.log('StorageService.cacheStorage');
        try {
            const { storage } = this.browser;
            const { settings } = await storage.sync.get('settings');
            if (typeof settings !== 'string') {
                throw new Error('Invalid settings storage');
            }
            console.log('StorageService.cacheStorage', settings);
            const validState = this.parseValidState(settings);
            this.setInternalState(validState);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Whether the key in storage should be in state
     */
    private isKeyValid(key: string) {
        console.log('StorageService.isKeyValid');
        const defaultState = this.makeDefaultState();
        const defaultStateKeys = Object.keys(defaultState);
        return defaultStateKeys.includes(key);
    }
    /**
     * Retrieve the current in memory state
     */
    public getState() {
        console.log('StorageService.getState', this.state);
        return this.state;
    }

    /**
     * Provide expected defaults for what our memory
     * store and persistent storage should contain
     */
    private makeDefaultState() {
        console.log('StorageService.makeDefaultState');
        return {
            enableAutomaticSorting: true,
        };
    }

    /**
     * Parse valid values for top-level state only without
     * checking if the types of values are what we expect
     */
    private parseValidState(state: string) {
        console.log('StorageService.parseValidState', state);
        if (!state) {
            throw new Error('No state to parse');
        }
        const parsedState = JSON.parse(state);
        const stateKeys = Object.keys(parsedState);
        // TODO: Is there a way to actually make
        // this more statically type safe
        const validState: Partial<MkSsState> = {};
        stateKeys.forEach((stateKey) => {
            const isKeyValid = this.isKeyValid(stateKey);
            if (!isKeyValid) {
                return;
            }
            validState[stateKey] = parsedState[stateKey];
        });
        console.log('StorageService.parseValidState', validState);
        return validState;
    }

    /**
     * Update the current in memory state where state is currently
     * expected to be only one level and not support deep copies
     */
    private setInternalState(internalState: Partial<MkSsState>) {
        console.log('StorageService.setInternalState', internalState);
        const state = {
            ...this.state,
            ...internalState,
        };
        this.state = state;
        return state;
    }

    /**
     * Store a value directly in persistent storage
     */
    public async setState(state: Partial<MkSsState>) {
        console.log('StorageService.setState');
        try {
            // Best to set in memory state immediately instead of relying on on
            // storage updated event so we can be sure our state is accurate at
            // the right time when it may be accessed.
            const internalState = this.setInternalState(state);
            const serializedState = JSON.stringify(internalState);
            const items = { settings: serializedState };
            await this.browser.storage.sync.set(items);
        } catch (error) {
            throw error;
        }
    }
}
