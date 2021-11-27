export interface MkIsGroupChanged {
    currentUrl: string;
    id: number;
}

export interface MkOrganizationTab {
    active: boolean;
    id?: number;
    pinned: boolean;
    url?: string;
    windowId: number;
}

export type MkOrganizerType = 'collapse' | 'default';

export interface MkOrganizeParams {
    clean?: boolean;
    tab?: MkOrganizationTab;
    type?: MkOrganizerType;
}
