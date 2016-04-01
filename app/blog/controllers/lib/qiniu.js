var request = require('request');
var qiniu = require('qiniu');
var config = require('../../../../config/config.js');

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SERECT_KEY;

var qiniuClient = new qiniu.rs.Client();

var QnUtil = function () {
  this.conf = {
    bucketName: 'zhanglun',
    host: 'http://7i7gl0.com1.z0.glb.clouddn.com/'
  };
};

module.exports = new QnUtil();


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
