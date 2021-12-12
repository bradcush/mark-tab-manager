import { MkOrganizationTab, MkOrganizerType } from './MkOrganize';
import { MkTabIdsByGroup } from './MkCategorize';

export interface MkIsGroupToOpen {
    activeTabId?: number;
    groupIds: number[];
    updatedTabId?: number;
}

export interface MkGetGroupInfoParams {
    id: number;
    name: string;
}

export interface MkMakeTitleParams {
    groupName: string;
    ids: number[];
}

export type MkActiveTabIdsByWindowKey = number;
export type MkActiveTabIdsByWindowValue = number | undefined;
export type MkActiveTabIdsByWindow = Map<number, number | undefined>;

export interface MkRenderGroupsByNameParams {
    activeTabIdsByWindow: MkActiveTabIdsByWindow;
    type: MkOrganizerType;
    tabIdsByGroup: MkTabIdsByGroup;
    updatedTab?: MkOrganizationTab;
}

export interface MkRender {
    organizeType: MkOrganizerType;
    newTab?: MkOrganizationTab;
    tabs: MkOrganizationTab[];
}
