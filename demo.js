const qiniu = require('qiniu');
const path = require('path');
const fs = require('fs');
const mime = require('mime');

const ACCESS_KEY = 'fZv_f_wX_ka0faszVvXcDAgRMRWEnjiyOHfCBuGa';
const SECRET_KEY = '-UXI4VD90-ZJzoGW--NOj8UUtA0fMmYpox5_WVUf';

const bucketName = 'mz-navigation';

//自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
var options = {scope: bucketName, expires: 3600};

var mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
var config = new qiniu.conf.Config();
var bucketManager = new qiniu.rs.BucketManager(mac, config);
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);
var formUploader = new qiniu.form_up.FormUploader(config);
const distPath = path.resolve(__dirname, '../dist');
var cdnManager = new qiniu.cdn.CdnManager(mac);

// 列举bucket
// bucketManager.listBucket((err, buckerList, body) => {});

// 列举bucket下文件列表
// bucketManager.listPrefix(bucketName, {}, (err, list, body) => {});

// 获取指定目录下的文件列表
function getDirFileNameList(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, {}, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
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