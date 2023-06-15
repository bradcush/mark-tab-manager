export function isTabsUngroupSupported(): boolean {
    return !!chrome.tabs.ungroup;
}

export function tabsUngroup(tabIds: number[]): Promise<void> {
    if (!isTabsUngroupSupported()) {
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
