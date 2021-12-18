export function isSupported(): boolean {
    return !!chrome.tabGroups?.onUpdated;
}

function addListener(
    // Using MkTabGroup since tabGroups
    // are missing from official typings
    callback: (group: chrome.tabGroups.TabGroup) => void
): void {
    if (!isSupported()) {
        throw new Error('No tabGroups.onUpdated support');
    }
    chrome.tabGroups.onUpdated.addListener((group) => {
        if (chrome.runtime.lastError) {
            const message =
                chrome.runtime.lastError.message ??
                'Unknown chrome.runtime.lastError';
            throw new Error(message);
        }
        callback(group);
    });
}

export const onUpdated = {
    addListener,
};
