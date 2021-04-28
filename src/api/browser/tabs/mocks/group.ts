import { MkOptions } from '../MkGroup';

/**
 * Mock function for testing the browser
 * API wrapped function directly
 */
export function groupMock(
    _options: MkOptions,
    callback?: (groupId: number) => void
): void {
    if (!callback) {
        return;
    }
    const groupId = 2;
    callback(groupId);
}
