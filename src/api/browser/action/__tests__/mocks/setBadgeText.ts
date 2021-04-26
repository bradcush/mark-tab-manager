import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Mock function for testing the browser
 * API wrapped function directly
 */
export function setBadgeTextMock(
    _details: MkBrowser.action.BadgeTextDetails,
    callback?: () => void
): void {
    if (!callback) {
        return;
    }
    callback();
}
