export interface MkIsGroupChanged {
    currentUrl: string;
    id: number;
}

export type MkOrganizerType = 'collapse' | 'default';

export interface MkOrganizeParams {
    clean?: boolean;
    // TODO: Use typings specific to group domain
    tab?: chrome.tabs.Tab;
    type?: MkOrganizerType;
}
