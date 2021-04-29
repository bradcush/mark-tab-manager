import { MkBrowser } from 'src/api/MkBrowser';

export type MkOnClickedHandler = (
    info: MkBrowser.contextMenus.OnClickedData,
    tabs: MkBrowser.tabs.Tab
) => void;
