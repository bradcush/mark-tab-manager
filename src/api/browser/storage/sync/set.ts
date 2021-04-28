import { MkSyncItems } from './MkSync';

export function set(items: MkSyncItems): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        chrome.storage.sync.set(items, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}
