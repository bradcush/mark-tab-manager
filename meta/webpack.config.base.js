const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, '../src/background.ts'),
    output: {
        filename: 'background.js',
        path: path.resolve(__dirname, '../dist'),
    },
    resolve: {
        // Add ".ts" and ".tsx" as a resolvable extension
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            src: path.resolve(__dirname, '../src'),
        },
    },
    module: {
        rules: [
            // All files with a ".ts" or ".tsx" extension handled
            { test: /\.tsx?$/, loader: 'ts-loader' },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            ENABLE_BOOKMARK_COUNTER: JSON.stringify(true),
        }),
        new CopyPlugin({
            patterns: [
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
                {
                    // Copy "icons" file from source
                    from: path.resolve(__dirname, '../src/icons'),
                    to: 'icons',
                },
            ],
        }),
    ],
};
