import { MkOrganizationTab, MkOrganizerType } from './MkOrganize';
import { MkTabIdsByGroup } from './MkCategorize';

export interface MkGetGroupInfoParams {
    title: string;
    id: number;
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
}

export interface MkRender {
    organizeType: MkOrganizerType;
    tabs: MkOrganizationTab[];
}
