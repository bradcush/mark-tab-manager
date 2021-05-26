import { MkOnUpdatedHandler } from './browser/tabs/MkOnUpdated';
import { MkOnRemovedHandler } from './browser/tabs/MkOnRemoved';
import { MkOnClickedHandler as MkActionOnClickedHandler } from './browser/action/MkOnClicked';
import { MkOnClickedHandler as MkContextMenusOnClickedHandler } from './browser/contextMenus/MkOnClicked';

interface MkActionListeners {
    onClickedListeners: MkActionOnClickedHandler[];
}

interface MkContextMenusListeners {
    onClickedListeners: MkContextMenusOnClickedHandler[];
}

interface MkTabsListeners {
    onUpdatedListeners: MkOnUpdatedHandler[];
    onRemovedListeners: MkOnRemovedHandler[];
}

export interface MkListeners {
    action: MkActionListeners;
    contextMenus: MkContextMenusListeners;
    tabs: MkTabsListeners;
}
