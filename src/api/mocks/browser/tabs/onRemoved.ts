import { listeners } from 'src/api/mocks/listeners';

export function onRemoved(): void {
    const { onRemovedListeners } = listeners.tabs;
    onRemovedListeners.forEach((onRemovedListener) => {
        onRemovedListener();
    });
}
