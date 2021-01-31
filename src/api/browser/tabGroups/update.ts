import { MkUpdateProperties } from './MkUpdate';

export function update(
    groupId: number,
    updateProperties: MkUpdateProperties
): Promise<void> {
    // @ts-expect-error Currently in Beta channel
    if (!chrome.tabGroups?.update) {
        throw new Error('No tabGroups.update support');
    }
    return new Promise<void>((resolve, reject) => {
        /* eslint-disable-next-line */ /* @ts-expect-error Currently in Beta channel */
        chrome.tabGroups.update(groupId, updateProperties, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}

export function isSupported(): boolean {
    // @ts-expect-error Currently in Beta channel
    return !!chrome.tabGroups?.update;
}
