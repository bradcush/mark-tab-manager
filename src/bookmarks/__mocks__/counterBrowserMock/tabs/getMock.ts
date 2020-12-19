import { MkGetMockCallback } from './MkGetMock';
import { MkBrowser } from 'src/api/MkBrowser';

export function getMock(_tabId: string, callback: MkGetMockCallback) {
    const tab = {
        url: 'https://www.example.com',
    } as MkBrowser.tabs.Tab;
    callback(tab);
}
