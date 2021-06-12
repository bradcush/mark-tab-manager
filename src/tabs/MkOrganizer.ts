import { MkBrowser } from 'src/api/MkBrowser';
import { MkStore } from 'src/storage/MkStore';
import { MkCache } from 'src/storage/MkCache';
import { MkSorter } from './MkSorter';
import { MkGrouper } from './MkGrouper';

export interface MkOrganizer {
    connect(): void;
    organize(params?: MkOrganizeParams): Promise<void>;
}

export interface MkContstructorParams {
    cache: MkCache;
    tabsGrouper: MkGrouper;
    tabsSorter: MkSorter;
    store: MkStore;
}

export interface MkIsGroupChanged {
    currentUrl: string;
    id: number;
}

export type MkOrganizerType = 'collapse' | 'default';

export interface MkOrganizeParams {
    clean?: boolean;
    tab?: MkBrowser.tabs.Tab;
    type?: MkOrganizerType;
}
