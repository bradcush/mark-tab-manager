import { MkOnActivatedHandler } from './browser/tabs/MkOnActivated';
import { MkOnUpdatedHandler } from './browser/tabs/MkOnUpdated';
import { MkOnRemovedHandler } from './browser/tabs/MkOnRemoved';
import { MkOnCreatedHandler } from './browser/bookmarks/MkOnCreated';
import { MkOnClickedHandler as MkActionOnClickedHandler } from './browser/action/MkOnClicked';
import { MkOnClickedHandler as MkContextMenusOnClickedHandler } from './browser/contextMenus/MkOnClicked';

interface MkActionListeners {
    onClickedListeners: MkActionOnClickedHandler[];
}

interface MkBookmarksListeners {
    onCreatedListeners: MkOnCreatedHandler[];
}

interface MkContextMenusListeners {
    onClickedListeners: MkContextMenusOnClickedHandler[];
}

interface MkTabsListeners {
    onActivatedListeners: MkOnActivatedHandler[];
    onUpdatedListeners: MkOnUpdatedHandler[];
    onRemovedListeners: MkOnRemovedHandler[];
}

export interface MkListeners {
    action: MkActionListeners;
    bookmarks: MkBookmarksListeners;
    contextMenus: MkContextMenusListeners;
    tabs: MkTabsListeners;
}
