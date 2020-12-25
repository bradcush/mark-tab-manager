import { organizerBrowserMock } from '../organizerBrowserMock';
import { makeQueryMock } from 'src/api/__mocks__/browserMock/tabs/queryMock';
import { MkMakeOrganizerBrowserMockParams } from './MkMakeOrganizerBrowserMock';
import { makeSyncMock } from 'src/api/__mocks__/browserMock/storage/syncMock';
import { MkBrowser } from 'src/api/MkBrowser';

export function makeOrganizerBrowserMock({
    tabs,
    items,
}: MkMakeOrganizerBrowserMockParams) {
    return {
        ...organizerBrowserMock,
        storage: {
            sync: (makeSyncMock(items) as any) as MkBrowser.storage.Sync,
        },
        tabs: {
            ...organizerBrowserMock.tabs,
            query: makeQueryMock(tabs),
        },
    };
}
