const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: path.resolve("./src/main.ts"),
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
    fallback: {
      fs: false,
    },
  },
  plugins: [new Dotenv(), new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })],
  externals: { puppeteer: 'require("puppeteer")' },
  target: "node",
};
