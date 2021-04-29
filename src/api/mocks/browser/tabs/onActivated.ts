import { listeners } from 'src/api/mocks/listeners';

export function onActivated(tabId: number): void {
    const { onActivatedListeners } = listeners.tabs;
    onActivatedListeners.forEach((onActivatedListener) => {
        const activeInfo = {
            tabId,
            windowId: 2,
        };
        onActivatedListener(activeInfo);
    });
}
