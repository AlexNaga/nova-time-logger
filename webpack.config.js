const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: path.resolve('./src/app.ts'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist')
  },
  watch: true,
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: ['awesome-typescript-loader?module=es6'],
        exclude: [/node_modules/]
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json']
  },
  plugins: [
    new Dotenv(),
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
  ],
  externals: { puppeteer: 'require("puppeteer")', },
  target: 'node',
  node: {
    __dirname: false,
    // Fixes npm packages that depend on `fs` module
    fs: 'empty'
  },
};