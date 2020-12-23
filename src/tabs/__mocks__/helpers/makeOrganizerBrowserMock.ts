import { organizerBrowserMock } from '../organizerBrowserMock';
import { makeQueryMock } from 'src/api/__mocks__/browserMock/tabs/queryMock';
import { MkBrowser } from 'src/api/MkBrowser';

export function makeOrganizerBrowserMock(tabs: MkBrowser.tabs.Tab[]) {
    return {
        ...organizerBrowserMock,
        tabs: {
            ...organizerBrowserMock.tabs,
            query: makeQueryMock(tabs),
        },
    };
}
