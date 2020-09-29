const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: ['./src/js/index.js', 'babel-polyfill'],
    output: {
        path: path.resolve(__dirname,'assets'),
        filename:'js/bundle.js'
    },
    devServer: {
        contentBase: './assets'
    },
    plugins:[
        new Dotenv(),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'./src/index.html'
        })
    ],
    module:{
        rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }

};