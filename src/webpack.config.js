const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './build/app.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist')
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/
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
  externals: {
    // bufferutil: 'commonjs bufferutil',
    // 'utf-8-validate': 'commonjs utf-8-validate',
    puppeteer: 'require("puppeteer")',
    taskz: 'require("taskz")',
  },
  target: 'node',
  node: {
    __dirname: false,
    // Fixes npm packages that depend on `fs` module
    fs: 'empty'
  },
};