export function get(id: number): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
        chrome.tabs.get(id, (tab) => {
            if (chrome.runtime.lastError) {
                const message =
                    chrome.runtime.lastError.message ??
                    'Unknown chrome.runtime.lastError';
                reject(message);
            }
            resolve(tab);
        });
    });
}
