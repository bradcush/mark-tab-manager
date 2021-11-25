export function setBadgeBackgroundColor(
    details: chrome.action.BadgeBackgroundColorDetails
): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.action.setBadgeBackgroundColor(details, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}
