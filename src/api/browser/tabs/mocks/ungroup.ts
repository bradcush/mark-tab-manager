/**
 * Mock function for testing the browser
 * API wrapped function directly
 */
export function ungroupMock(_tabIds: number[], callback?: () => void): void {
    if (!callback) {
        return;
    }
    callback();
}
