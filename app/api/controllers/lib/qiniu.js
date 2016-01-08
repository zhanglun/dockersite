var request = require('request');
var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = 'NV5FJcwvt4OzP2o-6K2xDLejrYeXkv38lb667OZw';
qiniu.conf.SECRET_KEY = 'C63IXuCpEtDoyw11pU1IcStBm6RR21nAN8M4duod';

var qiniuClient = new qiniu.rs.Client();

var QnUtil = function () {
  this.conf = {
    bucketName: 'blog',
    host: 'http://7xnrrd.com1.z0.glb.clouddn.com/'
  };
};

module.exports = new QnUtil();


/**
 * 获取上传token
 * @return {[type]} [description]
 */
QnUtil.prototype.getToken = function(){
  var _this = this;
  var bucketname = _this.conf.bucketName;
  var putPolicy = new qiniu.rs.PutPolicy(bucketname);
  //putPolicy.callbackUrl = callbackUrl;
  //putPolicy.callbackBody = callbackBody;
  //putPolicy.returnUrl = returnUrl;
  var body = JSON.stringify({
    "name": '$(fname)',
    "size": '$(fsize)',
    "type": '$(mimeType)',
    "hash": '$(etag)',
    'key': '$(key)',
    "width": '$(imageInfo.width)',
    "height": '$(imageInfo.height)',
  });
  putPolicy.returnBody = body;
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
