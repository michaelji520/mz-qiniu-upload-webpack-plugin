/**
 * Copyright (c) 2014-2018 NighthawkStudio, All rights reserved.
 * @fileoverview
 * @author Michael Zhang | michaelji520@gmail.com
 * @version 1.0 | 2021-05-15 | initial version
 */
const path = require('path');
const fs = require('fs')


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

function main() {
  list = getDirFileNameList(path.resolve(__dirname, './test'))
  console.log(list);
}

main();
