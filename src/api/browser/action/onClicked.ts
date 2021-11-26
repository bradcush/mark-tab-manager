function addListener(callback: (tab: chrome.tabs.Tab) => void): void {
    chrome.action.onClicked.addListener(callback);
}

export const onClicked = {
    addListener,
};
