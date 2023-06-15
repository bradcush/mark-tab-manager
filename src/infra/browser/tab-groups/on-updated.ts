export function isTabGroupsOnUpdatedSupported(): boolean {
    return !!chrome.tabGroups?.onUpdated;
}

function addListener(
    callback: (group: chrome.tabGroups.TabGroup) => void
): void {
    if (!isTabGroupsOnUpdatedSupported()) {
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

export const tabGroupsOnUpdated = {
    addListener,
};
