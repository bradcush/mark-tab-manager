import { MkSyncGetKeys, MkSyncItems } from '../MkSync';

/**
 * Mock storage.sync.get for
 * mapped api testing
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
