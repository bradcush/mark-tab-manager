import { listeners } from 'src/api/__mocks__/listeners';

export function onCreated(): void {
    const { onCreatedListeners } = listeners.bookmarks;
    onCreatedListeners.forEach((onCreatedListener) => {
        onCreatedListener();
    });
}
