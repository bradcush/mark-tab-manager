function addListener(
    callback: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void
): void {
    chrome.tabs.onRemoved.addListener(callback);
}

export const onRemoved = {
    addListener,
};
