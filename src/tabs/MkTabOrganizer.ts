import { MkBrowser } from 'src/api/MkBrowser';

export interface MkTabOrganizer {
    init(): void;
}

interface MkToBrowserAction {
    onClicked: MkBrowser.action.OnClicked;
}

interface MkToBrowserRuntime {
    lastError: MkBrowser.runtime.LastError;
}

interface MkToBrowserStorage {
    sync: MkBrowser.storage.Sync;
}

interface MkToBrowserTabs {
    move: MkBrowser.tabs.Move;
    onUpdated: MkBrowser.tabs.OnUpdated;
    query: MkBrowser.tabs.Query;
}

export interface MkToBrowser {
    action: MkToBrowserAction;
    runtime: MkToBrowserRuntime;
    storage: MkToBrowserStorage;
    tabs: MkToBrowserTabs;
}
