

class MZQiniuUploadWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const pluginName = MZQiniuUploadWebpackPlugin.name;
    compiler.hooks.done.tap(pluginName, (stats) => {
      console.log(stats);
    });
  }
}

