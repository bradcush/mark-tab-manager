export function runtimeSetUninstallUrl(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.runtime.setUninstallURL(url, () => {
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
