import { MkManifest, MkManifestBrowser } from './MkGenerate';

/**
 * Make the manifest description
 * tailored to the browser vendor
 */
function makeDescription(browser: MkManifestBrowser) {
    return browser === 'edge'
        ? 'The missing tab manager for Edge'
        : 'The missing tab manager for Chrome';
}

/**
 * Returns a manifest object
 * adapted to the browser
 */
export function make(browserVendor: MkManifestBrowser): MkManifest {
    const baseManifest: Partial<MkManifest> = {
        action: {
            default_title: 'Mark',
        },
        background: {
            service_worker: 'background.js',
        },
        description: makeDescription(browserVendor),
        icons: {
            '16': 'icons/icon-mark-16.png',
            '48': 'icons/icon-mark-48.png',
            '128': 'icons/icon-mark-128.png',
        },
        manifest_version: 3,
        name: 'Mark tab manager',
        offline_enabled: true,
        permissions: [
            'contextMenus',
            'management',
            'storage',
            'tabGroups',
            'tabs',
        ],
        version: '0.1.31',
    };
    const conditionalManifest: Partial<MkManifest> = {};
    if (browserVendor === 'edge') {
        // Edge requires setting the update url to check the store for updates
        // https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/developer-guide/port-chrome-extension
        conditionalManifest.update_url =
            'https://edge.microsoft.com/extensionwebstorebase/v1/crx';
    }
    return {
        ...baseManifest,
        ...conditionalManifest,
    };
}
