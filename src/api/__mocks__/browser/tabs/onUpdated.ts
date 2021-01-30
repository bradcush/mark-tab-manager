import { listeners } from 'src/api/__mocks__/listeners';
import { MkBrowser } from 'src/api/MkBrowser';

export function onUpdated(): void {
    const { onUpdatedListeners } = listeners.tabs;
    onUpdatedListeners.forEach((onUpdatedListener) => {
        const tabId = 1;
        const url = 'https://www.example.com';
        const changeInfo = { url };
        const tab = { url } as MkBrowser.tabs.Tab;
        onUpdatedListener(tabId, changeInfo, tab);
    });
}