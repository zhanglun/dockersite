var request = require('request');
var qiniu = require('qiniu');
var config = require('../../../../config/config.js');

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SERECT_KEY;

//var qiniuClient = new qiniu.rs.Client();

function QnUtil() {
  this.conf = {
    bucketName: 'blog',
    host: 'http://7xnrrd.com1.z0.glb.clouddn.com/'
  };
  this.client = new qiniu.rs.Client();
}

module.exports = new QnUtil();


/**
 * 获取上传token
 * @return {[type]} [description]
 */
QnUtil.prototype.getToken = function () {
  var _this = this;
  var bucketname = _this.conf.bucketName;
  var putPolicy = new qiniu.rs.PutPolicy(bucketname);
  //putPolicy.callbackUrl = callbackUrl;
  //putPolicy.callbackBody = callbackBody;
  //putPolicy.returnUrl = returnUrl;
  putPolicy.deadline = new Date().getTime() + 3600 * 1000;
  putPolicy.returnBody = JSON.stringify({
    "name": '$(fname)',
    "size": '$(fsize)',
    "type": '$(mimeType)',
    "hash": '$(etag)',
    'key': '$(key)',
    "width": '$(imageInfo.width)',
    "height": '$(imageInfo.height)'
  });
  //putPolicy.asyncOps = asyncOps;
  //putPolicy.expires = expires;

  return putPolicy.token();
};

/**
 * bucket file list
 * @param prefix
 * @param marker
 * @param limit
 */
QnUtil.prototype.getFileList = function (prefix, marker, limit) {
  var _this = this;
  var bucketName = _this.conf.bucketName;
  return new Promise(function (resolve, reject) {

    qiniu.rsf.listPrefix(bucketName, prefix, marker, limit, function (err, ret) {
      if (err) {
        reject(err);
      } else {
        resolve(ret);
        // http://developer.qiniu.com/docs/v6/api/reference/rs/list.html
      }
    });
  });

};


QnUtil.prototype.loadFile = function (key) {
  var _this = this;
  return new Promise(function (resolve, reject) {
    request({
      url: _this.conf.host + '/' + key,
      method: 'get'
    }, function (err, http, body) {
      if (err) {
        reject(body);
      } else {
        resolve(http, body);
      }
    })
  });
};

/**
 * 删除文件
 * @param keylist
 * @returns {Promise}
 */
QnUtil.prototype.deleteFile = function (keylist) {
  var _this = this;
  var _pathlist = keylist.map(function (key) {
    return new qiniu.rs.EntryPath(_this.conf.bucketName, key);
  });
  return new Promise(function (resolve, reject) {
    _this.client.batchDelete(_pathlist, function (err, ret) {
      if (err) {
        reject(err);
      } else {
        resolve(ret);
      }
    });
  });

};
