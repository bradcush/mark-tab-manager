import { MkBrowser } from 'src/api/MkBrowser';

export function query(
    queryInfo: MkBrowser.tabs.QueryInfo
): Promise<MkBrowser.tabs.Tab[]> {
    return new Promise<MkBrowser.tabs.Tab[]>((resolve, reject) => {
        chrome.tabs.query(queryInfo, (tabs) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve(tabs);
        });
    });
}
