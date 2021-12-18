import { MkTabGroup } from './MkGroup';

export function isSupported(): boolean {
    // tabGroups not yet in official typings
    /* eslint-disable-next-line */ /* @ts-expect-error */
    return !!chrome.tabGroups?.onUpdated;
}

function addListener(
    // Using MkTabGroup since tabGroups
    // are missing from official typings
    callback: (group: MkTabGroup) => void
): void {
    if (!isSupported()) {
        throw new Error('No tabGroups.onUpdated support');
    }
    // tabGroups not yet in official typings
    /* eslint-disable */
    /* @ts-expect-error */
    chrome.tabGroups.onUpdated.addListener((group) => {
        /* eslint-enable */
        if (chrome.runtime.lastError) {
            const message =
                chrome.runtime.lastError.message ??
                'Unknown chrome.runtime.lastError';
            throw new Error(message);
        }
        callback(group);
    });
}

export const onUpdated = {
    addListener,
};
