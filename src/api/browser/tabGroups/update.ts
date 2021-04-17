import { MkUpdateProperties } from './MkUpdate';

export function update(
    groupId: number,
    updateProperties: MkUpdateProperties
): Promise<void> {
    // tabGroups not yet in official typings
    /* eslint-disable-next-line */ /* @ts-expect-error */
    if (!chrome.tabGroups?.update) {
        throw new Error('No tabGroups.update support');
    }
    return new Promise((resolve, reject) => {
        // tabGroups not yet in official typings
        /* eslint-disable-next-line */ /* @ts-expect-error */
        chrome.tabGroups.update(groupId, updateProperties, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}

export function isSupported(): boolean {
    // tabGroups not yet in official typings
    /* eslint-disable-next-line */ /* @ts-expect-error */
    return !!chrome.tabGroups?.update;
}
