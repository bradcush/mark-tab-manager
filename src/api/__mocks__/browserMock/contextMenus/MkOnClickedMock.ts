import { MkBrowser } from 'src/api/MkBrowser';

export type MkContextMenusOnClickedMockHandler = (
    info: MkBrowser.contextMenus.OnClickedData,
    tabs: MkBrowser.tabs.Tab
) => void;
