import { browserMockListeners } from 'src/api/__mocks__/browserMockListeners';
import { MkBrowser } from 'src/api/MkBrowser';

export function onUpdatedMock() {
    const { onUpdatedListeners } = browserMockListeners.tabs;
    onUpdatedListeners.forEach((onUpdatedListener) => {
        const tabId = 1;
        const url = 'https://www.example.com';
        const changeInfo = { url };
        const tab = { url } as MkBrowser.tabs.Tab;
        onUpdatedListener(tabId, changeInfo, tab);
    });
}
