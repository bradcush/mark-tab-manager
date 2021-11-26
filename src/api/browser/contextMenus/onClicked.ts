function addListener(
    callback: (
        info: chrome.contextMenus.OnClickData,
        tab?: chrome.tabs.Tab
    ) => void
): void {
    chrome.contextMenus.onClicked.addListener(callback);
}

export const onClicked = {
    addListener,
};
