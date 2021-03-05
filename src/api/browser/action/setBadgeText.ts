import { MkBrowser } from 'src/api/MkBrowser';

export function setBadgeText(
    details: MkBrowser.action.BadgeTextDetails
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
