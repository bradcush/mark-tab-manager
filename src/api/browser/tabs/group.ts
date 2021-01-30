import { MkOptions } from './MkGroup';

export function group(options: MkOptions): Promise<number> {
    // @ts-expect-error Currently in Beta channel
    if (!chrome.tabs.group) {
        throw new Error('No tabs.group support');
    }
    return new Promise<number>((resolve, reject) => {
        /* eslint-disable-next-line */ /* @ts-expect-error Currently in Beta channel */
        chrome.tabs.group(options, (groupId) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve(groupId);
        });
    });
}
