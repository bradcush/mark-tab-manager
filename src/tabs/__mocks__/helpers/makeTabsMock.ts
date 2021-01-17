import { MkBrowser } from 'src/api/MkBrowser';

export function makeTabsMock() {
    return [
        {
            id: 10,
            url: 'chrome://newtab',
        },
        {
            id: 7,
            url: 'https://sub.sub.dragonfruit.com',
        },
        {
            id: 4,
            url: 'https://www.banana.com',
        },
        {
            id: 3,
            url: 'https://apple.com',
        },
        {
            id: 5,
            url: 'https://sub.cherry.com',
        },
        {
            id: 1,
            url: 'chrome://chrome-urls',
        },
        {
            id: 6,
            url: 'https://cherry.com',
        },
        {
            id: 9,
            url: 'https://fig.be',
        },
        {
            id: 8,
            url: 'https://elderberry.co.uk',
        },
        {
            id: 2,
            url: 'chrome://extensions',
        },
    ] as MkBrowser.tabs.Tab[];
}
