import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Mock tabs.get for
 * mapped api testing
 */
export function getMock(
    _id: number,
    callback?: (tab: MkBrowser.tabs.Tab) => void
): void {
    if (!callback) {
        return;
    }
    const tab = {
        id: 1,
        windowId: 2,
    } as MkBrowser.tabs.Tab;
    callback(tab);
}
