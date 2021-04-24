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

export interface MkState {
    clusterGroupedTabs: boolean;
    enableAutomaticGrouping: boolean;
    enableAlphabeticSorting: boolean;
    enableSubdomainFiltering: boolean;
    forceWindowConsolidation: boolean;
}
