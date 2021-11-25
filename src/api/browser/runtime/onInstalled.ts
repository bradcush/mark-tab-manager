function addListener(
    callback: (details: chrome.runtime.InstalledDetails) => void
): void {
    chrome.runtime.onInstalled.addListener(callback);
}

export const onInstalled = {
    addListener,
};
