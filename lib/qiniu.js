const qiniu = require('qiniu');
const path = require('path');
const fs = require('fs');
const mime = require('mime');

class Qiniu {
  ACCESS_KEY = '';
  SECRET_KEY = '';
  BUCKET_NAME = '';

  options = null;
  mac = null;
  config = null;
  pubPolicy = null;
  uploadToken = null;
  formUploader = null;
  cdnManager = null;

  constructor(ACCESS_KEY, SECRET_KEY, BUCKET_NAME) {
    if (!ACCESS_KEY || !SECRET_KEY || !BUCKET_NAME) throw new Error('Invalid ACCESS_KEY, SECRET_KEY or BUCKET_NAME!');

    this.ACCESS_KEY = ACCESS_KEY;
    this.SECRET_KEY = SECRET_KEY;
    this.BUCKET_NAME = BUCKET_NAME;

    this.init();
  }


  init() {
    //自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
    this.options = {scope: this.bucketName, expires: 7200};
    this.mac = new qiniu.auth.digest.Mac(this.ACCESS_KEY, this.SECRET_KEY);
    this.config = new qiniu.conf.Config();
    this.putPolicy = new qiniu.rs.PutPolicy(options);
    this.uploadToken = putPolicy.uploadToken(mac);
    this.formUploader = new qiniu.form_up.FormUploader(config);
    this.cdnManager = new qiniu.cdn.CdnManager(this.mac);
  }

  // 获取指定目录下的文件列表
  function getDirFileNameList(dir) {
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
}

// 文件上传
function upload(fileName, dir) {
  return new Promise((resolve, reject) => {
    const fileFullPath = `${bucketName}:${fileName}`;
    var options = {scope: fileFullPath, expires: 3600};
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    let putExtra = new qiniu.form_up.PutExtra();
    putExtra.fname = fileName;
    putExtra.mimeType = mime.getType(fileName);
    formUploader.putFile(uploadToken, fileName, `${dir}/${fileName}`, putExtra, function(respErr, respBody, respInfo) {
      if (respErr) throw respErr;
      if (respInfo.statusCode == 200) resolve(respBody);
      else console.log(respBody);
    });
  });
}

function refreshCDNDirs(dirs) {
  return new Promise((resolve, reject) => {
    cdnManager.refreshDirs(dirs, function(err, info, body) {qiniu
      if (err) reject(err);
      resolve(info);
    });
  });
}

async function main() {
  const files = await getDirFileNameList(distPath);
  const dirs2Refresh = ['http://cdn.zhangji.xyz/'];
  Promise.all(files.map((i) => {
    return upload(i, distPath);
  })).then((res) => {
    // console.log(res)
    return refreshCDNDirs(dirs2Refresh);
  }).then((info) => {
    console.log(info);
    console.log('execute refresh success!')
  }).catch((err) => {console.log(err)});
}
main();
