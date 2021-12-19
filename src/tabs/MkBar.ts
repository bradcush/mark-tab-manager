export interface MkAddNewGroupParams {
    color: chrome.tabGroups.ColorEnum;
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
    color: chrome.tabGroups.ColorEnum;
    groupId: number;
    title: string;
}
