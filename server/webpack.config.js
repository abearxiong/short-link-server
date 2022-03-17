/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const pkgs = require('./package.json');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // mode: 'production',
  entry: path.join(__dirname, './src/app.ts'),
  target: 'node',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'app.js'
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        // 使所有以 .json5 结尾的文件使用 `json5-loader`
        test: /\.json5$/,
        loader: 'json5-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.join(__dirname, './src'),
      ...pkgs._moduleAliase
    },
    // modules: pkgs._moduleDirectories || [] // eg: ["node_modules", "node_modules_custom", "src"]
  },
  externals: [nodeExternals()],

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/app.config.json5", to: "app.config.json5" },
      ],
    }),
  ],
  node: {
    // console: false,
    // global: false,
    // process: false,
    // Buffer: false,
    // __filename: false,
    // __dirname: false,
  }
}
