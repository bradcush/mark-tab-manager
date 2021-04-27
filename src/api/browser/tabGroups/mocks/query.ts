import { MkBrowser } from 'src/api/MkBrowser';
import { MkQueryInfo } from '../MkQuery';

/**
 * Factory for creating mock function to test
 * the browser API wrapped function directly
 */
export function makeQueryMock(groups: MkBrowser.tabGroups.TabGroup[]) {
    return (
        _queryInfo: MkQueryInfo,
        callback: (groups: MkBrowser.tabGroups.TabGroup[]) => void
    ): void => {
        callback(groups);
    };
}
