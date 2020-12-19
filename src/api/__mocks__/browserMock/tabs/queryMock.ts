import { MkBrowser } from 'src/api/MkBrowser';
import { MkQueryMockCallback } from './MkQueryMock';

/**
 * Make a mocked query function that
 * gives back the specified tabs
 */
export function makeQueryMock(tabs: MkBrowser.tabs.Tab[]) {
    return (
        _queryInfo: MkBrowser.tabs.QueryInfo,
        callback: MkQueryMockCallback
    ) => {
        callback(tabs);
    };
}
