import { MkSyncItems } from '../MkSync';

/**
 * Mock storage.sync.set for
 * mapped api testing
 */
export function setMock(_items: MkSyncItems, callback?: () => void): void {
    if (!callback) {
        return;
    }
    callback();
}
