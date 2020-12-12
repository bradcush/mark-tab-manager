const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
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
        new CopyPlugin({
            patterns: [
                {
                    // Copy "manifest.json" file from source
                    from: path.resolve(__dirname, '../src/manifest.json'),
                    to: 'manifest.json',
                },
                {
                    // Copy "index.html" file from source
                    from: path.resolve(__dirname, '../src/index.html'),
                    to: 'index.html',
                },
            ],
        }),
    ],
};
