import { MkBrowser } from 'src/api/MkBrowser';
import { MkSyncGetMockCallbackItems } from 'src/api/__mocks__/browserMock/storage/MkSyncMock';

export interface MkMakeOrganizerBrowserMockParams {
    items: MkSyncGetMockCallbackItems;
    tabs: MkBrowser.tabs.Tab[];
    group: MkBrowser.tabs.Group;
}
