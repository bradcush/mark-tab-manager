import { MkSyncGetItems, MkSyncGetKeys } from './MkSync';

export function get(keys: MkSyncGetKeys): Promise<MkSyncGetItems> {
    return new Promise<MkSyncGetItems>((resolve, reject) => {
        chrome.storage.sync.get(keys, (items) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve(items);
        });
    });
}
