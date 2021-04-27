import { listeners } from 'src/api/mocks/listeners';

export function onClicked(): void {
    const { onClickedListeners } = listeners.action;
    onClickedListeners.forEach((onClickedListener) => {
        onClickedListener();
    });
}
