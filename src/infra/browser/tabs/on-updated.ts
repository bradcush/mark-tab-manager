function addListener(
    callback: (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        tab: chrome.tabs.Tab
    ) => void
): void {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (chrome.runtime.lastError) {
            const message =
                chrome.runtime.lastError.message ??
                'Unknown chrome.runtime.lastError';
            throw new Error(message);
        }
        callback(tabId, changeInfo, tab);
    });
}

export const tabsOnUpdated = {
    addListener,
};
