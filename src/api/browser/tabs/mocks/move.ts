import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Mock tabs.move for
 * mapped api testing
 */
export function moveMock(
    _id: number,
    _moveProperties: MkBrowser.tabs.MoveProperties,
    callback?: () => void
): void {
    if (!callback) {
        return;
    }
    callback();
}
