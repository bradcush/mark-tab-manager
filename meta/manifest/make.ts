import { MkManifest } from './MkGenerate';

/**
 * Returns a manifest object
 * adapted to the browser
 */
export function make(): MkManifest {
    const manifest: Partial<MkManifest> = {
        action: {
            default_title: 'Mark',
        },
        background: {
            service_worker: 'background.js',
        },
        description: 'The missing browser tab manager',
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
        version: '0.1.36',
    };
    return manifest;
}
