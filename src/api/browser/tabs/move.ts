import { MkBrowser } from 'src/api/MkBrowser';

export function move(
    id: number,
    moveProperties: MkBrowser.tabs.MoveProperties
): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.tabs.move(id, moveProperties, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}
