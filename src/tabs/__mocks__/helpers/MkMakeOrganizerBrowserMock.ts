import { MkBrowser } from 'src/api/MkBrowser';
import { MkSyncGetMockCallbackItems } from 'src/api/__mocks__/browserMock/storage/MkSyncMock';

export interface MkMakeOrganizerBrowserMockParams {
    tabs: MkBrowser.tabs.Tab[];
    items: MkSyncGetMockCallbackItems;
}
