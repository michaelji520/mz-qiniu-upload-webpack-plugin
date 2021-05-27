const qiniu = require('qiniu');
const path = require('path');
const fs = require('fs');
const mime = require('mime');

class Qiniu {

  constructor({ACCESS_KEY, SECRET_KEY, BUCKET_NAME}) {
    if (!ACCESS_KEY || !SECRET_KEY || !BUCKET_NAME) throw new Error('Invalid ACCESS_KEY, SECRET_KEY or BUCKET_NAME!');

    this.ACCESS_KEY = ACCESS_KEY;
    this.SECRET_KEY = SECRET_KEY;
    this.BUCKET_NAME = BUCKET_NAME;

    this.init();
  }


  init() {
    this.mac = new qiniu.auth.digest.Mac(this.ACCESS_KEY, this.SECRET_KEY);
    this.config = new qiniu.conf.Config();
    this.formUploader = new qiniu.form_up.FormUploader(this.config);
    this.cdnManager = new qiniu.cdn.CdnManager(this.mac);
  }

  // 获取指定目录下的文件列表
  getDirFileNameList(dir) {
    const files = fs.readdirSync(dir);
    const result = [];
    files.forEach((item, index) => {
      let fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) result.push(...getDirFileNameList(path.join(dir, item)))
      else result.push(fullPath);
    });
    return result;
  }

  // 文件上传
  upload(fileName, dir) {
    return new Promise((resolve, reject) => {
      const fileFullPath = `${this.BUCKET_NAME}:${fileName}`;
      var options = {scope: fileFullPath, expires: 3600};
      var putPolicy = new qiniu.rs.PutPolicy(this.options);
      var uploadToken = putPolicy.uploadToken(this.mac);
      let putExtra = new qiniu.form_up.PutExtra();
      putExtra.fname = fileName;
      putExtra.mimeType = mime.getType(fileName);
      this.formUploader.putFile(uploadToken, fileName, `${dir}/${fileName}`, putExtra, function(respErr, respBody, respInfo) {
        if (respErr) reject(respErr);
        else resolve(respBody);
      });
    });
  }


  // 刷新CDN地址
  refreshCDNDirs(dirs) {
    return new Promise((resolve, reject) => {
      this.cdnManager.refreshDirs(dirs, function(err, info, body) {
        if (err) reject(err);
        resolve(info);
      });
    });
  }

}

module.exports = Qiniu;

