import { MkBrowser } from 'src/api/MkBrowser';

interface MkBrowserStorage {
    sync: MkBrowser.storage.Sync;
}

export interface MkStoreBrowser {
    storage: MkBrowserStorage;
}

export interface MkState {
    enableAutomaticSorting: boolean;
}

export interface MkStore {
    load(): void;
    getState(): Promise<MkState>;
    setState(state: Partial<MkState>): Promise<void>;
}
