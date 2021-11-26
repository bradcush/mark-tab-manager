function addListener(
    callback: (info: chrome.management.ExtensionInfo) => void
): void {
    chrome.management.onEnabled.addListener(callback);
}

export const onEnabled = {
    addListener,
};
