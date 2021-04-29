/**
 * Mock tabs.ungroup for
 * mapped api testing
 */
export function ungroupMock(_tabIds: number[], callback?: () => void): void {
    if (!callback) {
        return;
    }
    callback();
}
