export function setUninstallURL(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.runtime.setUninstallURL(url, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}
