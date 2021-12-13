function addListener(
    callback: (command: string, tab: chrome.tabs.Tab) => void
): void {
    chrome.commands.onCommand.addListener((command, tab) => {
        if (chrome.runtime.lastError) {
            const message =
                chrome.runtime.lastError.message ??
                'Unknown chrome.runtime.lastError';
            throw new Error(message);
        }
        callback(command, tab);
    });
}

export const onCommand = {
    addListener,
};
