import { MkBrowser } from 'src/api/MkBrowser';

export function makeTabsMock() {
    return [
        {
            id: 11,
            url: 'chrome://newtab',
        },
        {
            // Last element ignored by group tests
            // as pinned tabs aren't grouped
            id: 1,
            url: 'chrome://pinned',
            pinned: true,
        },
        {
            id: 8,
            url: 'https://sub.sub.dragonfruit.com',
        },
        {
            id: 5,
            url: 'https://www.banana.com',
        },
        {
            id: 4,
            url: 'https://apple.com',
        },
        {
            id: 6,
            url: 'https://sub.cherry.com',
        },
        {
            id: 2,
            url: 'chrome://chrome-urls',
        },
        {
            id: 7,
            url: 'https://cherry.com',
        },
        {
            id: 10,
            url: 'https://fig.be',
        },
        {
            id: 9,
            url: 'https://elderberry.co.uk',
        },
        {
            id: 3,
            url: 'chrome://extensions',
        },
    ] as MkBrowser.tabs.Tab[];
}
