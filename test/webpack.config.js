const path = require('path');
const MZQiniuUploadWebpackPlugin = require('../index.js');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './app.js'),
  output: {
    filename: 'app.[contenthash:8].js',
    path: path.resolve(__dirname, './dist')
  },
  plugins: [
    new MZQiniuUploadWebpackPlugin({
      bucket: 'mz-bucket',
      access_key: 'fZv_f_wX_ka0faszVvXcDAgRMRWEnjiyOHfCBuGa',
      secret_key: '-UXI4VD90-ZJzoGW--NOj8UUtA0fMmYpox5_WVUf',
      dirToUpload: path.resolve(__dirname, './test/dist/'),
      dirsToRefresh: ['http://cdn.zhangji.xyz/']
    })
  ]
};
