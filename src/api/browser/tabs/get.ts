import { MkBrowser } from 'src/api/MkBrowser';

export function get(id: number): Promise<MkBrowser.tabs.Tab> {
    return new Promise((resolve, reject) => {
        chrome.tabs.get(id, (tab) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve(tab);
        });
    });
}
