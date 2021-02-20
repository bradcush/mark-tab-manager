import { MkBrowser } from 'src/api/MkBrowser';

export function setBadgeBackgroundColor(
    details: MkBrowser.action.BadgeBackgroundColorDetails
): Promise<void> {
    return new Promise((resolve, reject) => {
        /* eslint-disable-next-line */ /* @ts-expect-error Recent Manifest v3 change */
        chrome.action.setBadgeBackgroundColor(details, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}
