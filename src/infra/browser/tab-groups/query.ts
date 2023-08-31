export function isTabGroupsQuerySupported(): boolean {
    return !!chrome.tabGroups?.query;
}

export function tabGroupsQuery(
    queryInfo: chrome.tabGroups.QueryInfo,
): Promise<chrome.tabGroups.TabGroup[]> {
    if (!isTabGroupsQuerySupported()) {
        throw new Error('No tabGroups.query support');
    }
    return new Promise((resolve, reject) => {
        chrome.tabGroups.query(queryInfo, (groups) => {
            if (chrome.runtime.lastError) {
                const message =
                    chrome.runtime.lastError.message ??
                    'Unknown chrome.runtime.lastError';
                reject(message);
            }
            resolve(groups);
        });
    });
}
