export interface MkItemProperties {
    checked?: boolean;
    contexts?: string[];
    id?: string;
    // Currently specified by chrome types using any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentId?: any;
    title?: string;
    type?: string;
    visible: boolean;
}

export interface MkMakeMenuItem {
    identifier: string;
    isChecked: boolean;
    format: string;
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
