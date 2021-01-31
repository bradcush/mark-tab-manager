import { listeners } from 'src/api/__mocks__/listeners';

export function onRemoved(): void {
    const { onRemovedListeners } = listeners.tabs;
    onRemovedListeners.forEach((onRemovedListener) => {
        onRemovedListener();
    });
}
