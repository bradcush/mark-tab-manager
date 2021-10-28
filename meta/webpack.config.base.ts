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
                    // Copy manifest.json file from generated files
                    // that are expected to be written previously
                    from: path.resolve(__dirname, `../generated/manifest.json`),
                    to: 'manifest.json',
                },
            ],
        }),
    ],
};
