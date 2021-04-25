import { MkBrowser } from 'src/api/MkBrowser';
import { MkLoggerConstructor } from 'src/logs/MkLogger';

export interface MkStore {
    load(): void;
    getState(): Promise<MkState>;
    setState(state: Partial<MkState>): Promise<void>;
}

interface MkBrowserStorage {
    sync: MkBrowser.storage.Sync;
}

export interface MkStoreBrowser {
    storage: MkBrowserStorage;
}

export interface MkConstructorParams {
    browser: MkStoreBrowser;
    Logger: MkLoggerConstructor;
}

// A collection of previous
// keys and their type
interface MkLegacyState {
    enableAutomaticSorting: boolean;
}

export type MkLegacyStateKey = keyof MkLegacyState;

export interface MkMigrateState {
    keys: MkPotentialStateKey[];
    state: MkPotentialState;
}

export type MkPotentialState = MkState & MkLegacyState;

export type MkPotentialStateKey = keyof MkState | keyof MkLegacyState;

export interface MkState {
    clusterGroupedTabs: boolean;
    enableAutomaticGrouping: boolean;
    enableAlphabeticSorting: boolean;
    enableSubdomainFiltering: boolean;
    forceWindowConsolidation: boolean;
}

export type MkStateKey = keyof MkState;
