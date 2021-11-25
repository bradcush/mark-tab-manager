export function create(
    createProperties: chrome.contextMenus.CreateProperties
): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.contextMenus.create(createProperties, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}
