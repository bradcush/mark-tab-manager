import { MkTabsOnActivatedMockHandler } from './browserMock/tabs/MkOnActivatedMock';
import { MkTabsOnUpdatedMockHandler } from './browserMock/tabs/MkOnUpdatedMock';
import { MkBookmarksOnCreatedMockHandler } from './browserMock/bookmarks/MkOnCreatedMock';
import { MkActionOnClickedMockHandler } from './browserMock/action/MkOnClickedMock';

interface MkBrowserActionListeners {
    onClickedListeners: MkActionOnClickedMockHandler[];
}

interface MkBrowserBookmarksListeners {
    onCreatedListeners: MkBookmarksOnCreatedMockHandler[];
}

interface MkBrowserTabsListeners {
    onActivatedListeners: MkTabsOnActivatedMockHandler[];
    onUpdatedListeners: MkTabsOnUpdatedMockHandler[];
}

export interface MkBrowserListeners {
    action: MkBrowserActionListeners;
    bookmarks: MkBrowserBookmarksListeners;
    tabs: MkBrowserTabsListeners;
}
