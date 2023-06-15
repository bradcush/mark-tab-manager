export type ActiveTabIdsByWindowId = Map<number, number | undefined>;

export type GroupFormat = 'collapse' | 'default';

export interface OrganizeTabParams {
    clean?: boolean;
    format?: GroupFormat;
    updatedTab?: chrome.tabs.Tab;
}

export interface TabIdsByGroup {
    [key: string]: Record<string, number[]>;
}

interface GroupTabCollectionItem {
    action: 'group';
    color: chrome.tabGroups.ColorEnum;
    opened: boolean;
    tabIds: number[];
    title: string;
    windowId: number;
}

interface UngroupTabCollectionItem {
    action: 'ungroup';
    tabIds: number[];
}

export type TabCollectionItem =
    | GroupTabCollectionItem
    | UngroupTabCollectionItem;
