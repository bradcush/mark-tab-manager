import { Configuration, DefinePlugin } from 'webpack';
import { merge } from './webpackMerge';
import { config as baseConfig } from './webpack.config.base';
import TerserPlugin from 'terser-webpack-plugin';

/**
 * Production webpack configuration containing only complementary
 * settings or those that specifically need overriding
 */
const config: Configuration = merge(baseConfig, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
            }),
        ],
    },
    plugins: [
        // Specify build-time globals
        new DefinePlugin({
            ENABLE_LOGGING: JSON.stringify(false),
        }),
    ],
});

export default config;
