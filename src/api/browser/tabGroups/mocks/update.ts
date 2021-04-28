import { MkUpdateProperties } from '../MkUpdate';

/**
 * Mock tabGroups.update for
 * mapped api testing
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
