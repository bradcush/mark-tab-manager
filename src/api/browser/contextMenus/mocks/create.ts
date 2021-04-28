import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Mock contextMenus.create
 * for mapped api testing
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
