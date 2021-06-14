import { MkBrowser } from 'src/api/MkBrowser';

export interface MkIsGroupChanged {
    currentUrl: string;
    id: number;
}

export type MkOrganizerType = 'collapse' | 'default';

export interface MkOrganizeParams {
    clean?: boolean;
    tab?: MkBrowser.tabs.Tab;
    type?: MkOrganizerType;
}
