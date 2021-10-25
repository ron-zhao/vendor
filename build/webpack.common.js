const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { entry } = require('./dev.config');

module.exports = {
    entry,
    output: {
        path: path.resolve('dist'),
        filename: '[id].[hash].js',
        publicPath: '/'
    },
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@root': path.resolve('src'),
            '@layout': path.resolve('src/views/layout'),
            '@components': path.resolve('src/components'),
            'style': path.resolve('src/common/sass')
        },
        extensions: ['.ts', '.tsx', '.js', '.json', '.vue', '.jsx'],
        modules: [path.resolve('src'), 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                }
            }, {
                test: /\.tsx$/,
                use: [
                    'babel-loader',
                    'ts-loader'
                ],
                exclude: /node_modules/
            }, {
                test: /\.vue$/,
                loader: [
                    'thread-loader',
                    'vue-loader?cacheDirectory=true'
                ],
                include: [
                    path.resolve('src'),
                    path.resolve('mock'),
                    path.resolve('test'),
                    path.resolve('node_modules/vue-echarts'),
                    path.resolve('node_modules/resize-detector')
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {importLoaders: 1}
                    },
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            modifyVars: {
                                'hack': `true; @import "${path.resolve('src/common/sass', 'var.less')}";`
                            }
                        }
                    }
                ]
            }, {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1 }
                    },
                    'postcss-loader'
                ]
            }, {
                test: /\.sass$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1 }
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            indentedSyntax: true
                        }
                    }
                ]
            }, {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.(jpg|png|gif|jpeg|md)$/,
                exclude: /node_modules/,
                use: 'file-loader'
            }, {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 100000
                    }
                }
            }]
    },
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                commons: {
                    name: 'vendor',
                    chunks: 'initial',
                    minChunks: 2
                }
            }
        }
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
