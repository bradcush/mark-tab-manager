export function contextMenusRemoveAll(): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.contextMenus.removeAll(() => {
            if (chrome.runtime.lastError) {
                const message =
                    chrome.runtime.lastError.message ??
                    'Unknown chrome.runtime.lastError';
                reject(message);
            }
            resolve();
        });
    });
}
