import { organizerBrowserMock } from '../organizerBrowserMock';
import { makeQueryMock } from 'src/api/__mocks__/browserMock/tabs/queryMock';
import { MkMakeOrganizerBrowserMockParams } from './MkMakeOrganizerBrowserMock';

export function makeOrganizerBrowserMock({
    tabs,
    group,
}: MkMakeOrganizerBrowserMockParams) {
    return {
        ...organizerBrowserMock,
        tabs: {
            ...organizerBrowserMock.tabs,
            group,
            query: makeQueryMock(tabs),
        },
    };
}
