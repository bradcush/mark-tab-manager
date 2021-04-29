import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Mock tabs.query for
 * mapped api testing
 */
export function queryMock(
    _queryInfo: MkBrowser.tabs.QueryInfo,
    callback?: (tabs: MkBrowser.tabs.Tab[]) => void
): void {
    if (!callback) {
        return;
    }
    const tab = {
        id: 1,
        windowId: 2,
    } as MkBrowser.tabs.Tab;
    callback([tab]);
}
