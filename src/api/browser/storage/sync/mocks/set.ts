import { MkSyncItems } from '../MkSync';

/**
 * Mock function for testing the browser
 * API wrapped function directly
 */
export function setMock(_items: MkSyncItems, callback?: () => void): void {
    if (!callback) {
        return;
    }
    callback();
}
