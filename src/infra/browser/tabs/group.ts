export function isTabsGroupSupported(): boolean {
    return !!chrome.tabs.group;
}

export function tabsGroup(options: chrome.tabs.GroupOptions): Promise<number> {
    if (!isTabsGroupSupported()) {
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
