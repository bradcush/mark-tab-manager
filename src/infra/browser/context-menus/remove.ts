export function contextMenusRemove(menuItemId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.contextMenus.remove(menuItemId, () => {
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
