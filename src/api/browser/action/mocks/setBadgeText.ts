import { MkBrowser } from 'src/api/MkBrowser';

/**
 * Mock action.setBadgeText
 * for mapped api testing
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
