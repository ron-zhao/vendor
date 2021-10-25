const Merge = require('webpack-merge');
const path = require('path');
const CommonConfig = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { version } = require('../package');

// 分析包大小，用于优化打包体积
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 分析打包时间
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const smp = new SpeedMeasurePlugin();

let directory = `${version}/`;

// module.exports = smp.wrap(Merge(CommonConfig, {
module.exports = Merge(CommonConfig, {
    mode: 'production',
    cache: true,
    entry: {
        // error
        // error: './src/error.js'
    },
    output: {
        path: path.resolve(`dist/${directory}`),
        chunkFilename: "[id].[chunkhash].js",
        publicPath: `${directory}`
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve('dist/index.html'),
            template: 'dev.html'
        })
        // new BundleAnalyzerPlugin()
    ]
});
// }));
