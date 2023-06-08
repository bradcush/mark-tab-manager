import { buildBase } from './build.base';

/**
 * Build production version
 */
await Bun.build({
    ...buildBase,
    minify: true,
    define: {
        // Specify build-time globals
        ENABLE_LOGGING: JSON.stringify(false),
    },
});
