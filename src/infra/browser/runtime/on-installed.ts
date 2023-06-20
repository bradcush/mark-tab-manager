function addListener(
    callback: (details: chrome.runtime.InstalledDetails) => void
): void {
    chrome.runtime.onInstalled.addListener((details) => {
        if (chrome.runtime.lastError) {
            const message =
                chrome.runtime.lastError.message ??
                'Unknown chrome.runtime.lastError';
            throw new Error(message);
        }
        callback(details);
    });
}

export const runtimeOnInstalled = {
    addListener,
};
