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

interface MkToBrowserTabs {
    move: MkBrowser.tabs.Move;
    query: MkBrowser.tabs.Query;
}

export interface MkToBrowser {
    action: MkToBrowserAction;
    runtime: MkToBrowserRuntime;
    tabs: MkToBrowserTabs;
}
