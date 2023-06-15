import { logError, logVerbose } from 'src/logs/console';
import {
    LegacyStateKey,
    MigratedState,
    PotentialState,
    State,
    StateKey,
} from './persisted-store-types';
import { Store } from './store-types';
import { storageSyncGet } from 'src/infra/browser/storage/sync/get';
import { storageSyncSet } from 'src/infra/browser/storage/sync/set';

/**
 * Loading, caching, and setting storage
 */
export class PersistedStore implements Store<State> {
    public constructor() {
        logVerbose('constructor');

        // Promise to resolve when state is loaded
        this.loaded = new Promise((resolve) => {
            this.resolveLoaded = resolve;
        });

        // Set defaults to be overridden
        this.state = this.makeDefaultState();
    }

    private readonly loaded: Promise<void>;
    private resolveLoaded: (() => void) | null = null;
    private state: State;

    /**
     * Fetch valid storage values and set
     * appropriate values in memory for access
     */
    private async cacheStorage() {
        logVerbose('cacheStorage');
        const { settings } = await storageSyncGet('settings');
        logVerbose('cacheStorage', settings);
        // If there is no storage we don't cache anything
        // from the outside and consider this step done
        if (typeof settings === 'undefined') {
            return;
        }
        // Invalid storage should be logged but
        // continue assuming local defaults
        if (typeof settings !== 'string') {
            const invalidError = new Error('Invalid settings storage');
            logError('cacheStorage', invalidError);
            return;
        }
        const validState = this.parseValidState(settings);
        this.setInternalState(validState);
    }

    /**
     * Get the new key name of an old
     * key that has been changed
     */
    private getMigratedKey(key: LegacyStateKey) {
        logVerbose('getMigratedKey', key);
        const migratedKeyByLegacy = {
            enableAutomaticSorting: 'enableAlphabeticSorting',
        } as const;
        const migratedKey = migratedKeyByLegacy[key];
        return migratedKey;
    }

    /**
     * Retrieve the current in memory state
     */
    public async getState(): Promise<State> {
        logVerbose('getState');
        // Wait for the initial data load
        await this.loaded;
        logVerbose('getState', this.state);
        return this.state;
    }

    /**
     * Test and type guard that the key
     * in storage should be in state
     */
    private isKeyValid = (key: string): key is StateKey => {
        logVerbose('isKeyValid');
        const defaultState = this.makeDefaultState();
        const defaultStateKeys = Object.keys(defaultState);
        return defaultStateKeys.includes(key);
    };

    /**
     * Test and type guard that the key in storage
     * is a valid key that is no longer supported
     */
    private isLegacyKeyValid = (key: string): key is LegacyStateKey => {
        logVerbose('isLegacyKeyValid');
        const legacyState = this.makeLegacyState();
        const legacyStateKeys = Object.keys(legacyState);
        return legacyStateKeys.includes(key);
    };

    /**
     * Type guard for what comes from storage to ensure
     * it looks like what we expect for state shape
     */
    private isPotentialState(state: unknown): state is PotentialState {
        return typeof state === 'object' && state !== null;
    }

    /**
     * Load existing sync storage into memory cache
     * and provide defaults for what hasn't been set
     */
    public async load(): Promise<void> {
        logVerbose('load');
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
        logVerbose('makeDefaultState');
        return {
            clusterGroupedTabs: true,
            enableAutomaticGrouping: true,
            enableAlphabeticSorting: true,
            enableSubdomainFiltering: false,
            forceWindowConsolidation: false,
            showGroupTabCount: true,
            suspendCollapsedGroups: false,
        };
    }

    /**
     * Collection of legacy keys that may exist in a users storage
     * and their original default values for reference
     */
    private makeLegacyState() {
        logVerbose('makeLegacyState');
        return {
            enableAutomaticSorting: true,
        };
    }

    /**
     * Migrate any settings under old key
     * names to their new key name
     */
    private migrateState({ keys, state }: MigratedState) {
        logVerbose('migrateState', keys);
        const legacyStateKeys = keys.filter(this.isLegacyKeyValid);
        const migratedState = legacyStateKeys.reduce<Partial<State>>(
            (acc, legacyStateKey) => {
                const migratedKey = this.getMigratedKey(legacyStateKey);
                acc[migratedKey] = state[legacyStateKey];
                return acc;
            },
            {}
        );
        logVerbose('migrateState', migratedState);
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
            if (!this.isPotentialState(parsedStateRaw)) {
                const parsingError = new Error('Error parsing state');
                logError('parseState', parsingError);
                // Unexpected types start clean
                return {};
            }
            return parsedStateRaw;
        } catch (error) {
            // Errors during parsing start clean
            // TODO: Unsure if this is a possbile
            // case we actually need to handle
            logError('parseState', error);
            return {};
        }
    }

    /**
     * Parse valid values for top-level state only without
     * checking if the types of values are what we expect.
     * Migrate any key names that maybe have changed.
     */
    private parseValidState(state: string) {
        logVerbose('parseValidState', state);
        const parsedState = this.parseState(state);
        const stateKeys = Object.keys(parsedState);
        // Migrate any keys where the name may have changed
        const validStateKeys = stateKeys.filter(this.isKeyValid);
        const validParsedState = validStateKeys.reduce<Partial<State>>(
            (acc, validStateKey) => {
                acc[validStateKey] = parsedState[validStateKey];
                return acc;
            },
            {}
        );
        logVerbose('parseValidState', validParsedState);
        // Migrating any previously named values during parsing without
        // immediately persisting means we rely on the setting of state
        // later to persist a migration change and can't assume everyone
        // who has this specific version has their migration persisted.
        const migratedState = this.migrateState({
            keys: stateKeys,
            state: parsedState,
        });
        const validState: Partial<State> = {
            ...validParsedState,
            ...migratedState,
        };
        logVerbose('parseValidState', validState);
        return validState;
    }

    /**
     * Update the current in memory state where state is currently
     * expected to be only one level and not support deep copies
     */
    private setInternalState(internalState: Partial<State>) {
        logVerbose('setInternalState', internalState);
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
    public async setState(state: Partial<State>): Promise<void> {
        logVerbose('setState', state);
        // Wait for the initial data load
        await this.loaded;
        // Best to set in memory state immediately instead of relying on
        // storage updated event so we can be sure our state is accurate
        // at the right time when it may be accessed.
        const internalState = this.setInternalState(state);
        const serializedState = JSON.stringify(internalState);
        logVerbose('setState', serializedState);
        const items = { settings: serializedState };
        await storageSyncSet(items);
    }
}
