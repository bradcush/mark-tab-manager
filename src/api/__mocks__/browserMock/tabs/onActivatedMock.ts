import { browserMockListeners } from 'src/api/__mocks__/browserMockListeners';

export function onActivatedMock(tabId: number) {
    const { onActivatedListeners } = browserMockListeners.tabs;
    onActivatedListeners.forEach((onActivatedListener) => {
        const activeInfo = {
            tabId,
            windowId: 2,
        };
        onActivatedListener(activeInfo);
    });
}
