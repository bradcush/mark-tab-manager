function addListener(
    callback: (info: chrome.management.ExtensionInfo) => void,
): void {
    chrome.management.onEnabled.addListener((info) => {
        if (chrome.runtime.lastError) {
            const message =
                chrome.runtime.lastError.message ??
                'Unknown chrome.runtime.lastError';
            throw new Error(message);
        }
        callback(info);
    });
}

export const managementOnEnabled = {
    addListener,
};
