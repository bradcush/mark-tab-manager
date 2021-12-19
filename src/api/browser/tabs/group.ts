export function isSupported(): boolean {
    return !!chrome.tabs.group;
}

export function group(options: chrome.tabs.GroupOptions): Promise<number> {
    if (!isSupported()) {
        throw new Error('No tabs.group support');
    }
    return new Promise<number>((resolve, reject) => {
        chrome.tabs.group(options, (groupId) => {
            if (chrome.runtime.lastError) {
                const message =
                    chrome.runtime.lastError.message ??
                    'Unknown chrome.runtime.lastError';
                reject(message);
            }
            resolve(groupId);
        });
    });
}
