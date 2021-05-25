/**
 * This is a sample webpack config file for test the plugin
 * To use it, you need to replace the plugin options with your own options
 */

const path = require('path');
const MZQiniuUploadWebpackPlugin = require('../index.js');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './app.js'),
  output: {
    filename: 'app.[contenthash:8].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: path.resolve(__dirname, './dist/assets/'),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|ico)$/i,
        loader: 'file-loader',
        options: {
          outputPath: './assets'
        }
      },
    ]
  },
  plugins: [
    new MZQiniuUploadWebpackPlugin(/* replace follow options with your own  */{
      BUCKET_NAME: 'BUCKET_NAME',
      ACCESS_KEY: 'ACCESS_KEY',
      SECRET_KEY: 'SECRET_KEY',
      dirsToRefresh: ['dir']
    })
  ]
};
