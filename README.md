# mz-qiniu-upload-webpack-plugin

### 插件功能：

1. 上传Webpack编译好的文件到七牛云存储
2. 刷新目录的CDN缓存(当且仅当配置了需要刷新的CDN目录时会在文件上传结束后自动刷新)

> 注意: 目前七牛云存储每天目录刷新次数为10次


### Install

```
npm i --save-dev mz-qiniu-upload-webpack-plugin
```

### Usage

```
const MZQiniuUploadWebpackPlugin = require('mz-qiniu-upload-webpack-plugin');

module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
    },
    plugins: [
      new MZQiniuUploadWebpackPlugin({
        BUCKET_NAME: 'Your Qiniu Bucket Name',
        ACCESS_KEY: 'Your Qiniu ACCESS_KEY',
        SECRET_KEY: 'Your Qiniu SECRET_KEY',
        dirsToRefresh: ['http://www.your-dir-to-refresh.com']
      })
    ]
  }
  ```


  本插件适配Webpack 5版本，不确保Webpack 4及以下版本的可用性

