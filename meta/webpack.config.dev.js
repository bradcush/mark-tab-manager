const baseConfig = require('./webpack.config.base');

module.exports = {
    ...baseConfig,
    mode: 'development',
    devtool: 'inline-source-map',
};
