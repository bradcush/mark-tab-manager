export function move(
    id: number,
    moveProperties: chrome.tabs.MoveProperties
): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.tabs.move(id, moveProperties, () => {
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
