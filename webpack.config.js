const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const pages = ['index', 'about', 'gallery', 'contact', 'product'];

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: './main.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
      publicPath: ''
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new Dotenv(),
      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : 'css/[name].[contenthash].css'
      }),
      // Handle index.html separately since it's in the root
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        chunks: ['main']
      }),
      // Handle other pages from the pages directory
      ...['about', 'gallery', 'contact', 'product'].map(page => new HtmlWebpackPlugin({
        template: `./pages/${page}.html`,
        filename: `${page}.html`,
        chunks: ['main']
      })),
      new CopyPlugin({
        patterns: [
          { 
            from: 'public',
            to: '.',
            globOptions: {
              ignore: ['**/index.html']
            }
          },
          { from: 'components', to: 'components' }
        ]
      })
    ],
    optimization: {
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin()
      ],
      minimize: !isDevelopment
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      hot: true,
      open: true,
      port: 3000,
      historyApiFallback: true
    },
    resolve: {
      extensions: ['.js']
    }
  };
}