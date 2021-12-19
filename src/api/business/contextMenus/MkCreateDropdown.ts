export interface MkDropdownLink {
    identifier: string;
    format: 'normal';
    title: string;
}

export interface MkDropdownToggle {
    identifier: string;
    isChecked: boolean;
    format: 'checkbox';
    title: string;
}

export type MkDropdownItem = MkDropdownLink | MkDropdownToggle;

export interface MkCreateDropdownParams {
    heading: string;
    children: MkDropdownItem[];
    label: string;
    location: chrome.contextMenus.ContextType;
}
