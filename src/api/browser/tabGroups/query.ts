import { MkBrowser } from 'src/api/MkBrowser';
import { MkQueryInfo } from './MkQuery';

export function query(
    queryInfo: MkQueryInfo
): Promise<MkBrowser.tabGroups.TabGroup[]> {
    // @ts-expect-error Currently in Beta channel
    if (!chrome.tabGroups?.query) {
        throw new Error('No tabGroups.query support');
    }
    return new Promise((resolve, reject) => {
        /* eslint-disable-next-line */ /* @ts-expect-error Currently in Beta channel */
        chrome.tabGroups.query(queryInfo, (groups) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve(groups);
        });
    });
}

export function isSupported(): boolean {
    // @ts-expect-error Currently in Beta channel
    return !!chrome.tabGroups?.query;
}
