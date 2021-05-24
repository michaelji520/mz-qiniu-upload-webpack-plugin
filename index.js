const Qiniu = require('./lib/qiniu');

class MZQiniuUploadWebpackPlugin {
  options = {};
  qiniu = null;
  constructor(options = {}) {
    console.log(options);
    this.options = options;
    this.qiniu = new Qiniu(this.options);
  }

  apply(compiler) {
    const pluginName = MZQiniuUploadWebpackPlugin.name;
    compiler.hooks.done.tap(pluginName, (stats) => {
      const files = stats.compilation.assets;
      console.log(files);
    });
  }
}

module.exports = MZQiniuUploadWebpackPlugin;

