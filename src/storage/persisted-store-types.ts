// A collection of previously
// used keys and their type
interface LegacyState {
    enableAutomaticSorting: boolean;
}

export type LegacyStateKey = keyof LegacyState;

export interface MigratedState {
    keys: string[];
    state: PotentialState;
}

export type PotentialState = Record<string, boolean>;

// State coincidentally happens to be
// settings only for the time being
export interface State {
    clusterGroupedTabs: boolean;
    enableAutomaticGrouping: boolean;
    enableAlphabeticSorting: boolean;
    enableSubdomainFiltering: boolean;
    forceWindowConsolidation: boolean;
    showGroupTabCount: boolean;
    suspendCollapsedGroups: boolean;
}

export type StateKey = keyof State;
