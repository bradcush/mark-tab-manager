export interface MkAddNewGroupParams {
    idx: number;
    opened: boolean;
    tabIds: number[];
    title: string;
    windowId: number;
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
