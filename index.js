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

      console.log('\nUploading files...\n');
      Promise.all(files.map((i) => {
        return this.qiniu.upload(i, dir);
      })).then((res) => {
        console.log('\nAll files uploaded!\n');
        return this.options.dirsToRefresh ? this.qiniu.refreshCDNDirs(this.options.dirsToRefresh) : Promise.resolve();
      }).then((info) => {
        this.options.dirsToRefresh && console.log('\nRefresh CDN success!\n');
      }).catch((err) => {console.log(err)});

    });
  }
}

module.exports = MZQiniuUploadWebpackPlugin;

