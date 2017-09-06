var webpack = require('webpack')
var path = require('path')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
    // var extractCSS = new ExtractTextPlugin('[name].bundle.css')

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        index: __dirname + '/assets/js/index.js',
        list: __dirname + '/assets/js/list.js',
        vendor: ['jquery', 'moment']
    },
    output: {
        path: __dirname + '/public',
        filename: 'static/js/[name].[id].js',
        publicPath: '/'
    },
    module: {
        rules: [{
                test: /\.js$/, //解析文件类型
                exclude: /node_modules/, //排除mode_modules文件
                loader: 'babel-loader', //使用哪种loader解析
                query: {
                    presets: ['es2015', 'stage-0'] //loader的配置项，解析es6
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(less|css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1, minimize: true } },
                        'postcss-loader'
                    ]
                })
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(
            ['public/*'], {
                root: __dirname,
                verbose: true,
                dry: false
            }
        ),

        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new ExtractTextPlugin("static/css/[name].bundle.css"),
        new UglifyJsPlugin({
            beautify: true,
            exclude: ['/node_modules/'],
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'assets/pages/index.html',
            chunks: ['vendor','manifest','index']
        }),
        new HtmlWebpackPlugin({
            filename: 'list.html',
            template: 'assets/pages/list.html',
            chunks: ['vendor','manifest','list']
        }),
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname + '/assets/img/temp'),
            to: path.resolve(__dirname + '/public/static/img'),
            ignore: ['.*']
        }])
    ],
    devServer: {
        inline: true,
        hot: true,
        port: 8282
    }
}