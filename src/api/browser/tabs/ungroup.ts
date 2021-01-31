export function ungroup(tabIds: number[]): Promise<void> {
    // @ts-expect-error Currently in Beta channel
    if (!chrome.tabs.ungroup) {
        throw new Error('No tabs.ungroup support');
    }
    return new Promise<void>((resolve, reject) => {
        /* eslint-disable-next-line */ /* @ts-expect-error Currently in Beta channel */
        chrome.tabs.ungroup(tabIds, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}

export function isSupported(): boolean {
    // @ts-expect-error Currently in Beta channel
    return !!chrome.tabs.ungroup;
}
