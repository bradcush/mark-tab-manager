import { OptionValues } from 'commander';
import { make as makeManifest } from './make';
import { Manifest } from './generate-types';

/**
 * Write manifest contents to standard output
 */
function writeContent(manifest: Manifest) {
    const manifestContent = JSON.stringify(manifest, null, 2);
    process.stdout.write(manifestContent);
}

/**
 * Create an extension manifest file
 * for a specific browser engine
 */
export function generate({ browser }: OptionValues): void {
    if (typeof browser !== 'string') {
        throw new Error('Browser vendor not a string');
    }
    const normalizedBrowser = browser.toLocaleLowerCase();
    if (normalizedBrowser !== 'chromium') {
        throw new Error('Browser vendor not supported');
    }
    const manifest = makeManifest();
    writeContent(manifest);
}
