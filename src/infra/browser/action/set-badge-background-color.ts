export function actionSetBadgeBackgroundColor(
    details: chrome.action.BadgeBackgroundColorDetails
): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.action.setBadgeBackgroundColor(details, () => {
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
