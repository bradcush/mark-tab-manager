import { MkBrowser } from 'src/api/MkBrowser';

export type MkOnActivatedHandler = (
    activeInfo: MkBrowser.tabs.TabActiveInfo
) => void;
