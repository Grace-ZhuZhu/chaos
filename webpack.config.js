const path = require('path');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist'),
    data: path.join(__dirname, 'data'),
};
const htmlPlugin = new HtmlWebPackPlugin({
    template: './src/index.html',
    filename: './index.html',
});
const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: 'main.bundle.css',
});
const copyWebpackPlugin = new CopyWebpackPlugin([
    {
        from: paths.data,
        to: `${paths.dist}/data`,
    }]);


module.exports = {
    output: {
        publicPath: 'dist',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['env', 'react'],
                    plugins: ['transform-class-properties'],
                },
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    devServer: {
        contentBase: paths.dist,
        compress: true,
        port: '3001',
        stats: 'errors-only',
    },
    plugins: [
        htmlPlugin,
        miniCssExtractPlugin,
        copyWebpackPlugin,
    ],
};
