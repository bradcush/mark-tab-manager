const baseConfig = require('./webpack.config.base');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    ...baseConfig,
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
        ],
    },
};
