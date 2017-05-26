var path = require('path');

module.exports = {
    entry: './src/index.js',
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: "babel-loader?presets=es2015"
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        library: 'XolaBackboneSDK',
        libraryTarget: 'umd'
    },
    externals: {
        "backbone": {
            commonjs: "backbone",
            commonjs2: "backbone",
            amd: "backbone",
            root: "Backbone"
        },
        "underscore": {
            commonjs: "underscore",
            commonjs2: "underscore",
            amd: "underscore",
            root: "_"
        },
        "jquery": {
            commonjs: "jquery",
            commonjs2: "jquery",
            amd: "jquery",
            root: "$"
        }
    }
};