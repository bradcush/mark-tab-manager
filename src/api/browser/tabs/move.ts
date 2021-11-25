export function move(
    id: number,
    moveProperties: chrome.tabs.MoveProperties
): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.tabs.move(id, moveProperties, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}
