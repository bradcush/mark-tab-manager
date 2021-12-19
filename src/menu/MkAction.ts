export interface MkMakeMenuItem {
    identifier: string;
    isChecked: boolean;
    format: chrome.contextMenus.ContextItemType;
    title: string;
}

/**
 * Generic port for
 * creating complex menus
 */
export interface MkMakeMenu {
    heading: string;
    items: MkMakeMenuItem[];
    label: string;
}
