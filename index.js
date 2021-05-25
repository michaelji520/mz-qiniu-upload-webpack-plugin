const Qiniu = require('./lib/qiniu');

class MZQiniuUploadWebpackPlugin {
  options = {};
  qiniu = null;
  constructor(options = {}) {
    this.options = options;
    this.qiniu = new Qiniu(this.options);
  }

  apply(compiler) {
    const pluginName = MZQiniuUploadWebpackPlugin.name;
    compiler.hooks.done.tap(pluginName, (stats) => {
      // 文件导出的dir
      const dir = compiler.options.output.path;
      const files = Object.keys(stats.compilation.assets);

      console.log('\nUploading files...')
      Promise.all(files.map((i) => {
        return this.qiniu.upload(i, dir);
      })).then((res) => {
        console.log('All files uploaded!')
        return this.options.dirsToRefresh ? this.qiniu.refreshCDNDirs(this.options.dirsToRefresh) : Promise.resolve();
      }).then((info) => {
        console.log('Refresh CDN success!')
      }).catch((err) => {console.log(err)});

    });
  }
}

module.exports = MZQiniuUploadWebpackPlugin;

