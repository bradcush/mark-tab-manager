export function storageSyncSet(items: Record<string, unknown>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        chrome.storage.sync.set(items, () => {
            if (chrome.runtime.lastError) {
                const message =
                    chrome.runtime.lastError.message ??
                    'Unknown chrome.runtime.lastError';
                reject(message);
            }
            resolve();
        });
    });
}
