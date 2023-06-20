import { Store } from './store-types';
import { State } from './persisted-store-types';

// Prepared to hold the store instance
let store: Store<State> | null = null;

/**
 * Retrieve the store instance
 */
export function getPersistedStore(): Store<State> {
    if (!store) {
        throw new Error('No persisted store instance');
    }
    return store;
}

/**
 * Set the single store instance
 */
export function setPersistedStore(instance: Store<State>): void {
    store = instance;
}
