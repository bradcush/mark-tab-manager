function addListener(
    callback: (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        tab: chrome.tabs.Tab
    ) => void
): void {
    chrome.tabs.onUpdated.addListener(callback);
}

export const onUpdated = {
    addListener,
};
