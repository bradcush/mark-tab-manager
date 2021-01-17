import { browserMockListeners } from 'src/api/__mocks__/browserMockListeners';

export function onRemovedMock() {
    const { onRemovedListeners } = browserMockListeners.tabs;
    onRemovedListeners.forEach((onRemovedListener) => {
        onRemovedListener();
    });
}
