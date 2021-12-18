import { MkSyncGetKeys, MkSyncItems } from './MkSync';

export function get(keys: MkSyncGetKeys): Promise<MkSyncItems> {
    return new Promise<MkSyncItems>((resolve, reject) => {
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
