export function actionSetBadgeText(
    details: chrome.action.BadgeTextDetails,
): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.action.setBadgeText(details, () => {
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
