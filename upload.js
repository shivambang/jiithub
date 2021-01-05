'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var multer  = require('multer')
var fs = require('fs')
var home = require("os").homedir();

const uploader = (req, type) => {
  
  var storage = multer.diskStorage({
    
    destination: function (req, file, callback) {
      var topic = req.body.topic;
      topic = topic.split('~');
      var cid = topic[0];
      var fid = topic[1];
      var name = topic[2];
      let dir = home+'/'+req.session.user+'/'+cid+'_'+fid+'_'+name;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
  });
  return multer({storage: storage}).array('files', 12);
}
exports.uploader = uploader;