export function isSupported(): boolean {
    return !!chrome.tabs.ungroup;
}

export function ungroup(tabIds: number[]): Promise<void> {
    if (!isSupported()) {
        throw new Error('No tabs.ungroup support');
    }
    return new Promise<void>((resolve, reject) => {
        chrome.tabs.ungroup(tabIds, () => {
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
