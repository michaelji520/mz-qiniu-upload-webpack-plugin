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
    new MZQiniuUploadWebpackPlugin({
      BUCKET_NAME: 'michaelji',
      ACCESS_KEY: 'fZv_f_wX_ka0faszVvXcDAgRMRWEnjiyOHfCBuGa',
      SECRET_KEY: '-UXI4VD90-ZJzoGW--NOj8UUtA0fMmYpox5_WVUf',
      dirToUpload: path.resolve(__dirname, './test/dist/'),
      dirsToRefresh: ['https://static.zhangji.xyz/']
    })
  ]
};
