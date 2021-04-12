import { MkStore } from 'src/storage/MkStore';
import { MkLoggerConstructor } from 'src/logs/MkLogger';
import { MkBrowser } from 'src/api/MkBrowser';

export interface MkSorter {
    renderSortedTabs(tabs: MkBrowser.tabs.Tab[]): Promise<void>;
    sortTabs(tabs: MkBrowser.tabs.Tab[]): Promise<MkBrowser.tabs.Tab[]>;
}

interface MkBrowserTabs {
    move: MkBrowser.tabs.Move;
}

export interface MkSorterBrowser {
    tabs: MkBrowserTabs;
}

export interface MkContstructorParams {
    browser: MkSorterBrowser;
    store: MkStore;
    Logger: MkLoggerConstructor;
}
