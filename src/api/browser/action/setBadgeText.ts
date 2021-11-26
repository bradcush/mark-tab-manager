export function setBadgeText(
    details: chrome.action.BadgeTextDetails
): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.action.setBadgeText(details, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}
