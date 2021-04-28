import { MkBrowser } from 'src/api/MkBrowser';
import { MkQueryInfo } from '../MkQuery';
import { MkColor } from '../MkColor';

const { BLUE } = MkColor;

/**
 * Mock tabGroups.query for
 * mapped api testing
 */
export function queryMock(
    _queryInfo: MkQueryInfo,
    callback: (groups: MkBrowser.tabGroups.TabGroup[]) => void
): void {
    const group = {
        collapsed: false,
        color: BLUE,
        title: 'match',
        windowId: 1,
    };
    callback([group]);
}
