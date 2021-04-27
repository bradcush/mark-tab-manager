import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Mock function for testing the browser
 * API wrapped function directly
 */
export function setBadgeBackgroundColorMock(
    _details: MkBrowser.action.BadgeBackgroundColorDetails,
    callback?: () => void
): void {
    if (!callback) {
        return;
    }
    callback();
}
