var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


module.exports = {
    mode: 'development',
    resolve: {
        mainFiles: ['index', 'Index'],
        extensions: ['.js', '.jsx', '.css', '.jpg', '.svg', '.png'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css?$/,
                loader: 'css-loader'
            },
            {
                test: /\.jpg?$/,
                loader: 'file-loader'
            },
            {
                test: /\.svg?$/,
                loader: 'file-loader'
            },
            {
                test: /\.png?$/,
                loader: 'file-loader'
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ]
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html'
    })],
    devServer: {
        historyApiFallback: true,
        port: 3000
    },
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: 'http://localhost:3000'
        })
    }
}