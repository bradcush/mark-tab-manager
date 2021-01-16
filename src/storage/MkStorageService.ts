import { MkBrowser } from 'src/api/MkBrowser';

interface MkSsBrowserStorage {
    sync: MkBrowser.storage.Sync;
}

export interface MkSsBrowser {
    storage: MkSsBrowserStorage;
}

export interface MkSsState {
    enableAutomaticSorting: boolean;
}

export interface MkStorageService {
    init(): void;
    getState(): MkSsState;
    setState(state: Partial<MkSsState>): Promise<void>;
}
