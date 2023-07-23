function addListener(callback: () => void): void {
    chrome.runtime.onStartup.addListener(() => {
        if (chrome.runtime.lastError) {
            const message =
                chrome.runtime.lastError.message ??
                'Unknown chrome.runtime.lastError';
            throw new Error(message);
        }
        callback();
    });
}

export const runtimeOnStartup = {
    addListener,
};
