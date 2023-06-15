import { SyncGetKeys, SyncItems } from './sync-types';

export function storageSyncGet(keys: SyncGetKeys): Promise<SyncItems> {
    return new Promise<SyncItems>((resolve, reject) => {
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
