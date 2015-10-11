var request = require('request');
var querystring = require('querystring');
var crypto = require('crypto');
var config = require('../config');
console.log(config);

var KuaiPan = {};

KuaiPan.createOauthParam = function () {

  var qsobj = {
    oauth_callback: config.kuaipan.oauth_callback,
    oauth_consumer_key: config.kuaipan.consumer_key,
    oauth_nonce: Math.random().toString(36).slice(2, 10) + '',
    oauth_signature_method: config.kuaipan.oauth_signature_method,
    oauth_timestamp: (new Date().getTime() + '').slice(0, 10) * 1,
    //oauth_consumer_secret: config.kuaipan.consumer_secret,
    oauth_version: config.kuaipan.oauth_version
  };
  return qsobj;
};

/**
 * 获取临时 token
 * @returns {string}
 */
KuaiPan.getRequestToken = function () {
  var base_uri = config.kuaipan.url.requestToken;
  var qsobj = this.createOauthParam();
  var base_string = 'GET' + '&' +
    encodeURIComponent(base_uri) + '&' +
    encodeURIComponent(querystring.stringify(qsobj));

  qsobj.oauth_signature = crypto.createHmac('sha1', config.kuaipan.consumer_secret + '&').update(base_string).digest('base64');

  var url = base_uri + '?' + querystring.stringify(qsobj);
  console.log(url);
  return url;
};

/**
 * 用户授权
 * @param temptoken
 */
KuaiPan.authorize = function (temptoken) {
  var url = config.kuaipan.url.authorize + temptoken;
  request(url, function (err, result) {
    console.log(result);
    //res.send(result);
  });

};

/**
 * 获取最终访问的 token
 * @param token
 * @returns {string}
 */
KuaiPan.getAccessToken = function (token, tokenserect, verifier) {
  var base_uri = config.kuaipan.url.accessToken;
  var qsobj = {
    //oauth_callback: config.kuaipan.oauth_callback,
    oauth_consumer_key: config.kuaipan.consumer_key,
    oauth_nonce: Math.random().toString(36).slice(2, 10) + '',
    oauth_signature_method: config.kuaipan.oauth_signature_method,
    oauth_timestamp: (new Date().getTime() + '').slice(0, 10) * 1,
    oauth_token: token,
    oauth_verifier: verifier,
    oauth_version: config.kuaipan.oauth_version
  };

  console.log(qsobj);

  var base_string = 'GET' + '&' +
    encodeURIComponent(base_uri) + '&' +
    encodeURIComponent(querystring.stringify(qsobj));

  qsobj.oauth_signature = crypto.createHmac('sha1', config.kuaipan.consumer_secret + '&' + tokenserect).update(base_string).digest('base64');

  var url = base_uri + '?' + querystring.stringify(qsobj);

  return url;
};


//KuaiPan.oauth = function () {
//  var temp_url = this.getRequestToken();
//  var temp_body = null;
//  request(temp_url, function (err, result) {
//    if (result.statusCode == 200) {
//      temp_body = JSON.parse(result.body);
//      KuaiPan.authorize(temp_body.auth_token);
//    } else {
//      // TODO: errorHandler
//    }
//  });
//};

module.exports = KuaiPan;
