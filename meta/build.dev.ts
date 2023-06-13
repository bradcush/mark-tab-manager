import { buildBase } from './build.base';

/**
 * Build development version
 */
await Bun.build({
    ...buildBase,
    // A code string passed into "eval" at runtime is considered remotely
    // hosted code in Manifest Version 3 and as a result is no longer allowed.
    // Therefore it's necessary that we don't use any devtool with "eval".
    // (https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#code-execution)
    // Furthermore, we must use inline source maps as Chrome Dev Tools won't
    // load source map files from the local "chrome-extension://" schema.
    sourcemap: 'inline',
    define: {
        // Specify build-time globals
        ENABLE_LOGGING: JSON.stringify(true),
    },
});
