import { MkSyncGetKeys, MkSyncItems } from '../MkSync';

/**
 * Mock function for testing the browser
 * API wrapped function directly
 */
export function getMock(
    _keys: MkSyncGetKeys,
    callback?: (items: MkSyncItems) => void
): void {
    if (!callback) {
        return;
    }
    const items = {
        settings: 'settings',
    };
    callback(items);
}
