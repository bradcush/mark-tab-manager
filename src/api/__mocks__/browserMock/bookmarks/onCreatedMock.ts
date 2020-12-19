import { browserMockListeners } from 'src/api/__mocks__/browserMockListeners';

export function onCreatedMock() {
    const { onCreatedListeners } = browserMockListeners.bookmarks;
    onCreatedListeners.forEach((onCreatedListener) => {
        onCreatedListener();
    });
}
