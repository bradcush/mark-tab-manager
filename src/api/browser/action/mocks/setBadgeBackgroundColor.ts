import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Mock action.setBadgeBackgroundColor
 * for mapped api testing
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
