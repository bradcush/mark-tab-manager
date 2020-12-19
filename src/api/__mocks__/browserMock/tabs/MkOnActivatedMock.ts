import { MkBrowser } from 'src/api/MkBrowser';

export type MkTabsOnActivatedMockHandler = (
    activeInfo: MkBrowser.tabs.TabActiveInfo
) => void;
