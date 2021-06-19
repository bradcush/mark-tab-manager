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

export interface MkSortTab {
    identifier?: number;
    windowId?: number;
}

export interface MkUpdateGroupTitleParams {
    collapsed: boolean;
    color: string;
    groupId: number;
    title: string;
}