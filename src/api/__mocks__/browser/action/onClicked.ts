import { listeners } from 'src/api/__mocks__/listeners';

export function onClicked(): void {
    const { onClickedListeners } = listeners.action;
    onClickedListeners.forEach((onClickedListener) => {
        onClickedListener();
    });
}
