import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Mock function for testing the browser
 * API wrapped function directly
 */
export function createMock(
    _createProperties: MkBrowser.contextMenus.CreateProperties,
    callback?: () => void
): void {
    if (!callback) {
        return;
    }
    callback();
}
