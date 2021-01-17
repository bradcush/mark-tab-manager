import { browserMock } from 'src/api/__mocks__/browserMock';
import { MkToBrowser } from '../MkTabOrganizer';
import { makeQueryMock as makeTabsQueryMock } from 'src/api/__mocks__/browserMock/tabs/queryMock';
import { colorMock } from './organizerBrowserMock/tabGroups/colorMock';

const organizerBrowserAction = {
    onClicked: browserMock.action.onClicked,
};

const organizerBrowserRuntime = {
    lastError: browserMock.runtime.lastError,
};

const organizerBrowserTabGroups = {
    Color: colorMock,
    update: jest.fn(),
};

const organizerBrowserTabs = {
    group: jest.fn(),
    move: jest.fn(),
    onUpdated: browserMock.tabs.onUpdated,
    onRemoved: browserMock.tabs.onRemoved,
    query: makeTabsQueryMock([]),
    ungroup: jest.fn(),
};

export const organizerBrowserMock = ({
    action: organizerBrowserAction,
    runtime: organizerBrowserRuntime,
    tabGroups: organizerBrowserTabGroups,
    tabs: organizerBrowserTabs,
} as any) as MkToBrowser;
