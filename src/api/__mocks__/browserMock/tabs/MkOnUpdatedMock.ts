import { MkBrowser } from 'src/api/MkBrowser';

export type MkTabsOnUpdatedMockHandler = (
    tabId: number,
    changeInfo: MkBrowser.tabs.ChangeInfo,
    tab: MkBrowser.tabs.Tab
) => void;
