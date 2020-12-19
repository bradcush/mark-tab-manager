import { browserMockListeners } from 'src/api/__mocks__/browserMockListeners';

export function onClickedMock() {
    const { onClickedListeners } = browserMockListeners.action;
    onClickedListeners.forEach((onClickedListener) => {
        onClickedListener();
    });
}
