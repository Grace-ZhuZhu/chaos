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
                test: /\.jsx?/,
                include: path.src,
                loader: 'babel-loader',
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015', 'stage-0'] },
                }],
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
        port: '4800',
        stats: 'errors-only',
    },
    plugins: [
        htmlPlugin,
        miniCssExtractPlugin,
        copyWebpackPlugin,
    ],
};
