function addListener(
    callback: (
        info: chrome.contextMenus.OnClickData,
        tab?: chrome.tabs.Tab
    ) => void
): void {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (chrome.runtime.lastError) {
            const message =
                chrome.runtime.lastError.message ??
                'Unknown chrome.runtime.lastError';
            throw new Error(message);
        }
        callback(info, tab);
    });
}

export const contextMenusOnClicked = {
    addListener,
};
