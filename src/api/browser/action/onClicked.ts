function addListener(callback: (tab: chrome.tabs.Tab) => void): void {
    chrome.action.onClicked.addListener((tab) => {
        if (chrome.runtime.lastError) {
            const message =
                chrome.runtime.lastError.message ??
                'Unknown chrome.runtime.lastError';
            throw new Error(message);
        }
        callback(tab);
    });
}

export const onClicked = {
    addListener,
};
