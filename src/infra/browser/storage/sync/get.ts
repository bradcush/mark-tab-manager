export function storageSyncGet(
    keys: string | Record<string, unknown>,
): Promise<Record<string, unknown>> {
    return new Promise<Record<string, unknown>>((resolve, reject) => {
        chrome.storage.sync.get(keys, (items) => {
            if (chrome.runtime.lastError) {
                const message =
                    chrome.runtime.lastError.message ??
                    'Unknown chrome.runtime.lastError';
                reject(message);
            }
            resolve(items);
        });
    });
}
