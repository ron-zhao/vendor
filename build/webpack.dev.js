const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./dev.config');

module.exports = Merge(CommonConfig, {
    mode: 'development',
    entry: {
        // mock
        // mock: './mock/index.js'
    },
    devServer: {
        hot: true,
        inline: true,
        port: config.port,
        compress: true,
        historyApiFallback: true,
        host: config.host,
        allowedHosts: ['.clouddn.com'],
        proxy: {
            [config.proxy_path]: {
                target: config.proxy_target,
                changeOrigin: true
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'dev.html'
        })
    ]
});
