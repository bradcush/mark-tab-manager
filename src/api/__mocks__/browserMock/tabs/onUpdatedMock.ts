import { browserMockListeners } from 'src/api/__mocks__/browserMockListeners';
import { MkBrowser } from 'src/api/MkBrowser';

export function onUpdatedMock() {
    const { onUpdatedListeners } = browserMockListeners.tabs;
    onUpdatedListeners.forEach((onUpdatedListener) => {
        const tabId = 1;
        const changeInfo = {};
        const tab = {
            url: 'https://www.example.com',
        } as MkBrowser.tabs.Tab;
        onUpdatedListener(tabId, changeInfo, tab);
    });
}
