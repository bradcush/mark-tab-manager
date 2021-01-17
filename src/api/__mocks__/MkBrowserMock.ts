import { MkTabsOnActivatedMockHandler } from './browserMock/tabs/MkOnActivatedMock';
import { MkTabsOnUpdatedMockHandler } from './browserMock/tabs/MkOnUpdatedMock';
import { MkTabsOnRemovedMockHandler } from './browserMock/tabs/MkOnRemovedMock';
import { MkBookmarksOnCreatedMockHandler } from './browserMock/bookmarks/MkOnCreatedMock';
import { MkActionOnClickedMockHandler } from './browserMock/action/MkOnClickedMock';
import { MkContextMenusOnClickedMockHandler } from './browserMock/contextMenus/MkOnClickedMock';

interface MkBrowserActionListeners {
    onClickedListeners: MkActionOnClickedMockHandler[];
}

interface MkBrowserBookmarksListeners {
    onCreatedListeners: MkBookmarksOnCreatedMockHandler[];
}

interface MkBrowserContextMenusListeners {
    onClickedListeners: MkContextMenusOnClickedMockHandler[];
}

interface MkBrowserTabsListeners {
    onActivatedListeners: MkTabsOnActivatedMockHandler[];
    onUpdatedListeners: MkTabsOnUpdatedMockHandler[];
    onRemovedListeners: MkTabsOnRemovedMockHandler[];
}

export interface MkBrowserListeners {
    action: MkBrowserActionListeners;
    bookmarks: MkBrowserBookmarksListeners;
    contextMenus: MkBrowserContextMenusListeners;
    tabs: MkBrowserTabsListeners;
}
