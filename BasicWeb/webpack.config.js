const webpack = require('webpack');
const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env ={}) => {

    const {mode = 'production', environment = 'production'} = env;

    const isProd = mode === 'production';

    const  getStyleLoaders = () => {
        return [isProd ? MiniCssExtractPlugin.loader : 'style-loader' , 'css-loader' ]
    };

    const dotenv = require('dotenv').config({path: __dirname + '/env.' + environment});

    const  getPlugins = () => {

        const plugins = [
            new webpack.EnvironmentPlugin([ 
            'API_BASE'
        ]),
            new CopyWebpackPlugin(
                {
                    patterns: [
                        { from: "./public/manifest.json", to:   "manifest.json" }
                    ]
                }),
            new HtmlWebpackPlugin({
                title: "BasicWeb",
                template: './public/index.html',
                hash: true,
                filename: 'index.html'
            }),
            new WorkboxPlugin.GenerateSW({
                maximumFileSizeToCacheInBytes: 50000000,
                clientsClaim: true,
                navigateFallback: '/index.html',
                skipWaiting: true,
                runtimeCaching: [
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                        handler: 'CacheFirst',
                        options: {
                            expiration: { maxEntries: 10 },
                            cacheName: 'images',
                        },
                    },
                    {
                        urlPattern: /.*\.(?:css)/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'styles-cache'
                        }
                    },
                    {
                        urlPattern: /.*\.(?:js)/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'scripts-cache'
                        }
                    },
                    {
                        urlPattern: new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'),
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'fonts-cache'
                        }
                    },
                    {
                        urlPattern: new RegExp('^' + dotenv.parsed.API_BASE),
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-responses-cache',
                            expiration: {
                                maxAgeSeconds: 10 * 60
                            },
                            cacheableResponse: { statuses: [0, 200] },
                        }
                    }
                ]
            })
        ];

        if (isProd)
        {
            plugins.push(new MiniCssExtractPlugin({
                filename:'main-[fullhash:8].css'
            }))
        }

        return plugins
    };

    return {
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.js',
            publicPath: '/',
        },
        mode: isProd ? 'production' : 'development',
        module: {
            rules:[
                {
                    test: /\.less$/,
                    use: [
                        ...getStyleLoaders(), "less-loader"
                    ]
                },
                {
                    test:/\.s[ca]ss$/,
                    exclude: /node_modules/,
                    use: [
                        ...getStyleLoaders(), 'sass-loader'
                    ]
                },
                {
                    test:/\.css$/,
                    use: getStyleLoaders()
                },
                {
                    test:/\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {loader: 'babel-loader'}
                    ]
                },
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    use:[{
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images',
                            name: '[name]-[sha1:fullhash:7].[ext]'
                        }
                    }]
                },
                {
                    test: /\.json$/,
                    use:[{
                        loader: 'file-loader'
                    }]
                },
                { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader" },
                { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader" },
            ]
        },
        devServer:{
            open: true,
            contentBase: path.resolve(__dirname, 'build'),
            compress: false,
            port: 5005,
            https: true,
            historyApiFallback: true,
        },
        plugins: getPlugins()
    }
};