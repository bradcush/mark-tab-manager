import * as path from 'path';
import { Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

/**
 * Base webpack configuration containing only shared,
 * static rules without conditional settings
 */
export const config: Configuration = {
    entry: path.resolve(__dirname, '../src/background.ts'),
    output: {
        filename: 'background.js',
        path: path.resolve(__dirname, '../dist'),
    },
    resolve: {
        // Add ".ts" and ".tsx" as a resolvable extension
        extensions: ['.ts', '.js', '.tsx'],
        alias: {
            src: path.resolve(__dirname, '../src'),
        },
    },
    module: {
        rules: [
            {
                // All ".ts" and ".tsx" files
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        // Clean the output directory contents
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    // Copy "icons" contents from source
                    from: path.resolve(__dirname, '../src/icons'),
                    to: 'icons',
                },
                {
                    // Copy "index.html" file from source
                    from: path.resolve(__dirname, '../src/index.html'),
                    to: 'index.html',
                },
                {
                    // Copy "manifest.json" file from source
                    from: path.resolve(__dirname, '../src/manifest.json'),
                    to: 'manifest.json',
                },
            ],
        }),
    ],
};
