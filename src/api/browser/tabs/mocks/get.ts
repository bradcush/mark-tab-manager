import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Mock function for testing the browser
 * API wrapped function directly
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
