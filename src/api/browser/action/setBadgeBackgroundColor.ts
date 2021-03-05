import { MkBrowser } from 'src/api/MkBrowser';

export function setBadgeBackgroundColor(
    details: MkBrowser.action.BadgeBackgroundColorDetails
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
