import { MkBrowser } from 'src/api/MkBrowser';

export type MkOnUpdatedHandler = (
    tabId: number,
    changeInfo: MkBrowser.tabs.ChangeInfo,
    tab: MkBrowser.tabs.Tab
) => void;
