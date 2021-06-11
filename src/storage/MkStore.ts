export interface MkStore {
    load(): void;
    getState(): Promise<MkState>;
    setState(state: Partial<MkState>): Promise<void>;
}

// A collection of previous
// keys and their type
interface MkLegacyState {
    enableAutomaticSorting: boolean;
}

export type MkLegacyStateKey = keyof MkLegacyState;

export interface MkMigrateState {
    keys: string[];
    state: MkPotentialState;
}

export type MkPotentialState = Record<string, boolean>;

export function isPotentialState(state: unknown): state is MkPotentialState {
    return typeof state === 'object' && state !== null;
}

export interface MkState {
    clusterGroupedTabs: boolean;
    enableAutomaticGrouping: boolean;
    enableAlphabeticSorting: boolean;
    enableSubdomainFiltering: boolean;
    forceWindowConsolidation: boolean;
    showGroupTabCount: boolean;
}

export type MkStateKey = keyof MkState;
