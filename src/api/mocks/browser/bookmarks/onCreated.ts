import { listeners } from 'src/api/mocks/listeners';

export function onCreated(): void {
    const { onCreatedListeners } = listeners.bookmarks;
    onCreatedListeners.forEach((onCreatedListener) => {
        onCreatedListener();
    });
}
