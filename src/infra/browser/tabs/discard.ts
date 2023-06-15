export function tabsDiscard(tabId?: number): Promise<chrome.tabs.Tab> {
    return new Promise<chrome.tabs.Tab>((resolve, reject) => {
        chrome.tabs.discard(tabId, (tab) => {
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
