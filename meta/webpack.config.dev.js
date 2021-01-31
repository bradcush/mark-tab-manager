const makeBaseConfig = require('./webpack.config.base');

const MODE = 'development';

module.exports = {
    ...makeBaseConfig({ mode: MODE }),
    mode: MODE,
    devtool: 'inline-source-map',
};
