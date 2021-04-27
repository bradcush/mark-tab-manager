import { MkUpdateProperties } from '../MkUpdate';

/**
 * Mock function for testing the browser
 * API wrapped function directly
 */
export function updateMock(
    _groupId: number,
    _updateProperties: MkUpdateProperties,
    callback?: () => void
): void {
    if (!callback) {
        return;
    }
    callback();
}
