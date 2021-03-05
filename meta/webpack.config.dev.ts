import { Configuration, DefinePlugin } from 'webpack';
import { merge } from './webpackMerge';
import { config as baseConfig } from './webpack.config.base';

/**
 * Development webpack configuration containing only complementary
 * settings or those that specifically need overriding
 */
const config: Configuration = merge(baseConfig, {
    mode: 'development',
    // A code string passed into "eval" at runtime is considered remotely
    // hosted code in Manifest Version 3 and as a result is no longer allowed.
    // Therefore it's necessary that we don't use any devtool with "eval".
    // (https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/#code-execution)
    // Furthermore, we must use inline source maps as Chrome Dev Tools won't
    // load source map files from the local "chrome-extension://" schema.
    devtool: 'inline-source-map',
    plugins: [
        // Specify build-time globals
        new DefinePlugin({
            ENABLE_BOOKMARK_COUNTER: JSON.stringify(true),
            ENABLE_LOGGING: JSON.stringify(true),
        }),
    ],
});

export default config;
