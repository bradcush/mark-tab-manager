import { ENTRYPOINT, OUTDIR } from './build-constants';

/**
 * Build production version
 */
const result = await Bun.build({
    entrypoints: [ENTRYPOINT],
    outdir: OUTDIR,
    minify: true,
    define: {
        // Specify build-time globals
        ENABLE_LOGGING: JSON.stringify(false),
    },
});

if (!result.success) {
    throw new AggregateError(result.logs);
}
