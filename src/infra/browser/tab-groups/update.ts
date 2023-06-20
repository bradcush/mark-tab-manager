export function isTabGroupsUpdateSupported(): boolean {
    return !!chrome.tabGroups?.update;
}

export function tabGroupsUpdate(
    groupId: number,
    updateProperties: chrome.tabGroups.UpdateProperties
): Promise<void> {
    if (!isTabGroupsUpdateSupported()) {
        throw new Error('No tabGroups.update support');
    }
    return new Promise((resolve, reject) => {
        chrome.tabGroups.update(groupId, updateProperties, () => {
            if (chrome.runtime.lastError) {
                const message =
                    chrome.runtime.lastError.message ??
                    'Unknown chrome.runtime.lastError';
                reject(message);
            }
            resolve();
        });
    });
}
