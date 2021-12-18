export function create(
    createProperties: chrome.contextMenus.CreateProperties
): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.contextMenus.create(createProperties, () => {
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
