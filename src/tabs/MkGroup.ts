import { MkBrowser } from 'src/api/MkBrowser';
import { MkOrganizerType } from './MkOrganize';
import { MkTabIdsByGroup } from './MkCategorize';

export interface MkAddNewGroupParams {
    idx: number;
    forceCollapse: boolean;
    name: string;
    tabIds: number[];
    windowId: number;
}

export interface MkGetGroupInfoParams {
    title: string;
    id: number;
}

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
    tabs: MkBrowser.tabs.Tab[];
}

export interface MkUpdateGroupTitleParams {
    collapsed: boolean;
    color: string;
    groupId: number;
    title: string;
}
