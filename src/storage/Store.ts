import {
    isPotentialState,
    MkConstructorParams,
    MkLegacyStateKey,
    MkMigrateState,
    MkState,
    MkStateKey,
    MkStore,
    MkStoreBrowser,
} from './MkStore';
import { MkLogger } from 'src/logs/MkLogger';

/**
 * Loading, caching, and setting storage
 * TODO: Store should specify a "GenericStorage"
 * port and be passed a "SyncStorage" adapter
 */
export class Store implements MkStore {
    public constructor({ browser, Logger }: MkConstructorParams) {
        if (!browser) {
            throw new Error('No browser');
        }
        this.browser = browser;

        if (!Logger) {
            throw new Error('No Logger');
        }
        this.logger = new Logger('Store');
        this.logger.log('constructor');

        // Promise to resolve when state is loaded
        this.loaded = new Promise((resolve) => {
            this.resolveLoaded = resolve;
        });

        // Set defaults to be overridden
        this.state = this.makeDefaultState();
    }

    private readonly browser: MkStoreBrowser;
    private readonly loaded: Promise<void>;
    private readonly logger: MkLogger;
    private resolveLoaded: (() => void) | null = null;
    private state: MkState;

    /**
     * Fetch valid storage values and set
     * appropriate values in memory for access
     */
    private async cacheStorage() {
        this.logger.log('cacheStorage');
        try {
            const { storage } = this.browser;
            const { settings } = await storage.sync.get('settings');
            this.logger.log('cacheStorage', settings);
            // If there is no storage we don't cache anything
            // from the outside and consider this step done
            if (typeof settings === 'undefined') {
                return;
            }
            // Invalid storage should be logged but
            // continue assuming local defaults
            if (typeof settings !== 'string') {
                const invalidError = new Error('Invalid settings storage');
                this.logger.error('cacheStorage', invalidError);
                return;
            }
            const validState = this.parseValidState(settings);
            this.setInternalState(validState);
        } catch (error) {
            this.logger.error('cacheStorage', error);
            throw error;
        }
    }

    /**
     * Test and type guard that the key in storage
     * is a valid key that is no longer supported
     */
    private isLegacyKeyValid = (key: string): key is MkLegacyStateKey => {
        this.logger.log('isLegacyKeyValid');
        const legacyState = this.makeLegacyState();
        const legacyStateKeys = Object.keys(legacyState);
        return legacyStateKeys.includes(key);
    };

    /**
     * Test and type guard that the key
     * in storage should be in state
     */
    private isKeyValid = (key: string): key is MkStateKey => {
        this.logger.log('isKeyValid');
        const defaultState = this.makeDefaultState();
        const defaultStateKeys = Object.keys(defaultState);
        return defaultStateKeys.includes(key);
    };

    /**
     * Get the new key name of an old
     * key that has been changed
     */
    private getMigratedKey(key: MkLegacyStateKey) {
        this.logger.log('getMigratedKey', key);
        const migratedKeyByLegacy = {
            enableAutomaticSorting: 'enableAlphabeticSorting',
        } as const;
        const migratedKey = migratedKeyByLegacy[key];
        return migratedKey;
    }

    /**
     * Retrieve the current in memory state
     */
    public async getState(): Promise<MkState> {
        this.logger.log('getState');
        // Wait for the initial data load
        await this.loaded;
        this.logger.log('getState', this.state);
        return this.state;
    }

    /**
     * Load existing sync storage into memory cache
     * and provide defaults for what hasn't been set
     */
    public async load(): Promise<void> {
        this.logger.log('load');
        await this.cacheStorage();
        // Indicate storage is loaded for
        // anyone who depends on it
        if (!this.resolveLoaded) {
            throw new Error('Resolve loaded not set');
        }
        this.resolveLoaded();
    }

    /**
     * Provide expected defaults for what our memory
     * store and persistent storage should contain
     */
    private makeDefaultState() {
        this.logger.log('makeDefaultState');
        return {
            clusterGroupedTabs: true,
            enableAutomaticGrouping: true,
            enableAlphabeticSorting: true,
            enableSubdomainFiltering: false,
            forceWindowConsolidation: false,
        };
    }

    /**
     * Collection of legacy keys that may exist in a users storage
     * and their original default values for reference
     */
    private makeLegacyState() {
        this.logger.log('makeLegacyState');
        return {
            enableAutomaticSorting: true,
        };
    }

    /**
     * Migrate any settings under old key
     * names to their new key name
     */
    private migrateState({ keys, state }: MkMigrateState) {
        this.logger.log('migrateState', keys);
        const migratedState: Partial<MkState> = {};
        const legacyStateKeys = keys.filter(this.isLegacyKeyValid);
        legacyStateKeys.forEach((legacyStateKey) => {
            const migratedKey = this.getMigratedKey(legacyStateKey);
            migratedState[migratedKey] = state[legacyStateKey];
        });
        this.logger.log('migrateState', migratedState);
        return migratedState;
    }

    /**
     * Parse the stringified state if possible
     * or pretend we have nothing in storage
     */
    private parseState(state: string) {
        try {
            // Better to type JSON as unknown for safety
            const parsedStateRaw = JSON.parse(state) as unknown;
            if (!isPotentialState(parsedStateRaw)) {
                const parsingError = new Error('Error parsing state');
                this.logger.error('parseValidState', parsingError);
                // Unexpected types start clean
                return {};
            }
            return parsedStateRaw;
        } catch (error) {
            // Errors during parsing start clean
            this.logger.error('parseValidState', error);
            return {};
        }
    }

    /**
     * Parse valid values for top-level state only without
     * checking if the types of values are what we expect.
     * Migrate any key names that maybe have changed.
     */
    private parseValidState(state: string) {
        this.logger.log('parseValidState', state);
        const parsedState = this.parseState(state);
        const stateKeys = Object.keys(parsedState);
        // Migrate any keys where the name may have changed
        const validParsedState: Partial<MkState> = {};
        const validStateKeys = stateKeys.filter(this.isKeyValid);
        validStateKeys.forEach((validStateKey) => {
            validParsedState[validStateKey] = parsedState[validStateKey];
        });
        this.logger.log('parseValidState', validParsedState);
        // Migrating any previously named values during parsing without
        // immediately persisting means we rely on the setting of state
        // later to persist a migration change and can't assume everyone
        // who has this specific version has their migration persisted.
        const migratedState = this.migrateState({
            keys: stateKeys,
            state: parsedState,
        });
        const validState: Partial<MkState> = {
            ...validParsedState,
            ...migratedState,
        };
        this.logger.log('parseValidState', validState);
        return validState;
    }

    /**
     * Update the current in memory state where state is currently
     * expected to be only one level and not support deep copies
     */
    private setInternalState(internalState: Partial<MkState>) {
        this.logger.log('setInternalState', internalState);
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
    public async setState(state: Partial<MkState>): Promise<void> {
        this.logger.log('setState', state);
        try {
            // Wait for the initial data load
            await this.loaded;
            // Best to set in memory state immediately instead of relying on
            // storage updated event so we can be sure our state is accurate
            // at the right time when it may be accessed.
            const internalState = this.setInternalState(state);
            const serializedState = JSON.stringify(internalState);
            this.logger.log('setState', serializedState);
            const items = { settings: serializedState };
            await this.browser.storage.sync.set(items);
        } catch (error) {
            this.logger.error('setState', error);
            throw error;
        }
    }
}
