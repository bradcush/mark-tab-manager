const makeBaseConfig = require('./webpack.config.base');
const TerserPlugin = require('terser-webpack-plugin');

const MODE = 'production';

module.exports = {
    ...makeBaseConfig({ mode: MODE }),
    mode: MODE,
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
