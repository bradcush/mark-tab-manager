export function query(
    queryInfo: chrome.tabs.QueryInfo
): Promise<chrome.tabs.Tab[]> {
    return new Promise<chrome.tabs.Tab[]>((resolve, reject) => {
        chrome.tabs.query(queryInfo, (tabs) => {
            if (chrome.runtime.lastError) {
                const message =
                    chrome.runtime.lastError.message ??
                    'Unknown chrome.runtime.lastError';
                reject(message);
            }
            resolve(tabs);
        });
    });
}
