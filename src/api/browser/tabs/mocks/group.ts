import { MkOptions } from '../MkGroup';

/**
 * Mock tabs.group for
 * mapped api testing
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
