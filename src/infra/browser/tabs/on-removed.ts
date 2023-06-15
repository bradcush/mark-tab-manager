function addListener(
    callback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void
): void {
    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
        if (chrome.runtime.lastError) {
            const message =
                chrome.runtime.lastError.message ??
                'Unknown chrome.runtime.lastError';
            throw new Error(message);
        }
        callback(tabId, removeInfo);
    });
}

export const tabsOnRemoved = {
    addListener,
};
