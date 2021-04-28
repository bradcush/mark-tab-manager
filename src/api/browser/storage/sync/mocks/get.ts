import { MkSyncGetItems, MkSyncGetKeys } from '../MkSync';

/**
 * Mock function for testing the browser
 * API wrapped function directly
 */
export function getMock(
    _keys: MkSyncGetKeys,
    callback?: (items: MkSyncGetItems) => void
): void {
    if (!callback) {
        return;
    }
    const items = {
        settings: 'settings',
    };
    callback(items);
}
