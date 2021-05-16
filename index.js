

class MZQiniuUploadWebpackPlugin {
  constructor(options = {}) {
    console.log(options);
    this.options = options;
  }

  apply(compiler) {
    const pluginName = MZQiniuUploadWebpackPlugin.name;
    compiler.hooks.done.tap(pluginName, (stats) => {
      console.log(stats.compilation.assets);
    });
  }
}

module.exports = MZQiniuUploadWebpackPlugin;

