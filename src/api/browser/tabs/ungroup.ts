export function ungroup(tabIds: number[]): Promise<void> {
    // tabs.ungroup not yet in official typings
    /* eslint-disable-next-line */ /* @ts-expect-error */
    if (!chrome.tabs.ungroup) {
        throw new Error('No tabs.ungroup support');
    }
    return new Promise<void>((resolve, reject) => {
        // tabs.ungroup not yet in official typings
        /* eslint-disable-next-line */ /* @ts-expect-error */
        chrome.tabs.ungroup(tabIds, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}

export function isSupported(): boolean {
    // tabs.ungroup not yet in official typings
    /* eslint-disable-next-line */ /* @ts-expect-error */
    return !!chrome.tabs.ungroup;
}
