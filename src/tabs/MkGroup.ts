import { MkOrganizerType } from './MkOrganize';
import { MkTabIdsByGroup } from './MkCategorize';

export type MkActiveTabIdsByWindowKey = number;
export type MkActiveTabIdsByWindowValue = number | undefined;
export type MkActiveTabIdsByWindow = Map<number, number | undefined>;

export interface MkRenderGroupsByNameParams {
    activeTabIdsByWindow: MkActiveTabIdsByWindow;
    type: MkOrganizerType;
    tabIdsByGroup: MkTabIdsByGroup;
}

export interface MkRender {
    organizeType: MkOrganizerType;
    // TODO: Use typings specific to group domain
    tabs: chrome.tabs.Tab[];
}
