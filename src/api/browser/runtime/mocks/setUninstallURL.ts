/**
 * Mock runtime.setUninstallURL
 * for mapped api testing
 */
export function setUninstallURLMock(url: string, callback?: () => void): void {
    if (!callback) {
        return;
    }
    callback();
}
