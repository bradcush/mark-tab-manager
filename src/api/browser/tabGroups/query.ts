import { MkBrowser } from 'src/api/MkBrowser';
import { MkQueryInfo } from './MkQuery';

export function query(
    queryInfo: MkQueryInfo
): Promise<MkBrowser.tabGroups.TabGroup[]> {
    if (!isSupported()) {
        throw new Error('No tabGroups.query support');
    }
    return new Promise((resolve, reject) => {
        // tabGroups not yet in official typings
        /* eslint-disable-next-line */ /* @ts-expect-error */
        chrome.tabGroups.query(queryInfo, (groups) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve(groups);
        });
    });
}

export function isSupported(): boolean {
    // tabGroups not yet in official typings
    /* eslint-disable-next-line */ /* @ts-expect-error */
    return !!chrome.tabGroups?.query;
}
