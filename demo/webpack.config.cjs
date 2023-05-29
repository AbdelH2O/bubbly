const path = require('path');
const webpack = require('webpack');
var copyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const bundleOutputDir = './dist';

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    return [{
        entry: './src/main.js',
        output: {
            filename: 'widget.js',
            path: path.resolve(bundleOutputDir),
        },
        devServer: {
            static: path.resolve(__dirname, bundleOutputDir),
        },
        plugins: isDevBuild
            ? [new webpack.SourceMapDevToolPlugin(), new copyWebpackPlugin({ patterns: ['dummy/'] })]
            : [],
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            })],
        },
        mode: isDevBuild ? 'development' : 'production',
        module: {
            rules: [
                { test: /\.html$/i, use: 'html-loader' },
                { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
                {
                    test: /\.js$/i, exclude: /node_modules/, use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [['@babel/env', {
                                'targets': {
                                    'browsers': ['ie 6', 'safari 7']
                                }
                            }]]
                        }
                    }
                }
            ]
        }
    }];
};