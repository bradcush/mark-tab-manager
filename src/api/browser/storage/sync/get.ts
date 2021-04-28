import { MkSyncGetKeys, MkSyncItems } from './MkSync';

export function get(keys: MkSyncGetKeys): Promise<MkSyncItems> {
    return new Promise<MkSyncItems>((resolve, reject) => {
        chrome.storage.sync.get(keys, (items) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve(items);
        });
    });
}
