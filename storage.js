'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var home = require("os").homedir();
const fs = require('fs-extra');


const ensureDir = (dir) => {
  fs.ensureDirSync(home+'/'+dir);
};
exports.ensureDir = ensureDir;

const listDir = (dir, callback) => {
  let dirPath = home+'/'+dir;
  let dirs = [] 
  fs.readdir(dirPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(function (file) {
      if(fs.lstatSync(dirPath+'/'+file).isDirectory())
        dirs = [...dirs, file]; 
    });
    return callback(dirs);
  });
}
exports.listDir = listDir;

const listFiles = (dir, callback) => {
  let dirs = [] 
  fs.readdir(dir, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(function (file) {
      if(!fs.lstatSync(dir+'/'+file).isDirectory())
        dirs = [...dirs, file]; 
    });
    return callback(dirs);
  });
}
exports.listFiles = listFiles;
