import { MkBrowser } from 'src/api/MkBrowser';
import { MkTabIdsByGroup } from './MkGroup';

export interface MkClusterParams {
    tabGroups: MkTabIdsByGroup;
    tabs: MkBrowser.tabs.Tab[];
}

export interface MkSortParams {
    groups: MkTabIdsByGroup;
    tabs: MkBrowser.tabs.Tab[];
}
