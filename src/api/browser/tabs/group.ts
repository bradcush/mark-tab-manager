import { MkOptions } from './MkGroup';

export function group(options: MkOptions): Promise<number> {
    // tabs.group not yet in official typings
    /* eslint-disable-next-line */ /* @ts-expect-error */
    if (!chrome.tabs.group) {
        throw new Error('No tabs.group support');
    }
    return new Promise<number>((resolve, reject) => {
        // tabs.group not yet in official typings
        /* eslint-disable-next-line */ /* @ts-expect-error */
        chrome.tabs.group(options, (groupId) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve(groupId);
        });
    });
}

export function isSupported(): boolean {
    // tabs.group not yet in official typings
    /* eslint-disable-next-line */ /* @ts-expect-error */
    return !!chrome.tabs.group;
}
