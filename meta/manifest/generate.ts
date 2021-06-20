import { Command, OptionValues } from 'commander';
import { make as makeManifest } from './make';
import { MkManifest } from './MkGenerate';

/**
 * Write manifest contents to standard output
 */
function writeContent(manifest: MkManifest) {
    const manifestContent = JSON.stringify(manifest, null, 2);
    process.stdout.write(manifestContent);
}

/**
 * Create an extension manifest file
 * for a specific browser vendor
 * Exporting function for testing only
 */
export function generate({ browser }: OptionValues): void {
    if (typeof browser !== 'string') {
        throw new Error('Browser vendor not a string');
    }
    const normalizedBrowser = browser.toLocaleLowerCase();
    if (normalizedBrowser !== 'chrome' && normalizedBrowser !== 'edge') {
        throw new Error('Browser vendor not supported');
    }
    const manifest = makeManifest(normalizedBrowser);
    writeContent(manifest);
}

// We only intend to run the generate script from the command-line but
// allow it to be imported for testing with coverage reporting
if (require.main === module) {
    const program = new Command();
    program.option('-b, --browser <browser>', 'Browser vendor, chrome or edge');
    program.parse(process.argv);
    const options = program.opts();
    generate(options);
}
