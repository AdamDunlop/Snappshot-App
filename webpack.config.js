var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'web/public', 'build');
var mainPath = path.resolve(__dirname, 'web/src', 'main.js');

var config = {
    devtool: 'inline-source-map',
    entry: [
        mainPath
    ],
    output: {
        path: buildPath,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: path.resolve(__dirname, 'web', 'src'),
                loader: 'babel',
                exclude: [nodeModulesPath],
                query: {
                    presets: ['es2015', 'react']
                }
            }
            // later on might want to add css and images loader when servic static and html content..
        ]
    }
};

module.exports = config;