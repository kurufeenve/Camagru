const webpack = require('webpack');
const path = require('path');
/*plugins*/
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    index: './src/scripts/index.js',
    //test: './src/scripts/index-test.js'
  },
  output: {
    path: dist,
    filename: '[name].js',
    chunkFilename: '[name].common.js'
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules|plato)/,
        loader: 'eslint-loader',
        options: {
          // quiet: true, failOnError: true,
        }
      }, {
        test: /\.js$/,
        exclude: /(node_modules|plato)/,
        use: 'babel-loader'
      }, {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: isProduction
            }
          }
        ]
      }, {
        test: /\.s?css$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        }))
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  devtool: 'source-map',
  devServer: {
    contentBase: dist, // boolean | string | array, static file location
    // compress: false, // enable gzip compression
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    // noInfo: true, // only errors & warns on hot reload port: 8080,
  },

  plugins: [
    new CleanWebpackPlugin([dist]),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      // filename: './index.html'
    }),
    new ExtractTextPlugin('styles.css'),
    // new MiniCssExtractPlugin({   filename: '[name].css',   chunkFilename:
    // '[id].css' }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
