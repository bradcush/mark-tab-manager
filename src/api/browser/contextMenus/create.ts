import { MkBrowser } from 'src/api/MkBrowser';

export function create(
    createProperties: MkBrowser.contextMenus.CreateProperties
): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.contextMenus.create(createProperties, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}
