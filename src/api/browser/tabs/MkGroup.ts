interface MkOptionsCreateProperties {
    windowId?: number;
}

// Group options manually specified until typings are official
// https://developer.chrome.com/docs/extensions/reference/tabs/#method-group
export interface MkOptions {
    createProperties?: MkOptionsCreateProperties;
    groupId?: number;
    tabIds: number | number[];
}
