var request = require('request');
var Promise = require('bluebird');
var querystring = require('querystring');
var _ = require('underscore');
var crypto = require('crypto');
var config = require('../config');

/**
 * Bluebird Promisification
 * 将不支持 promise 的 API 转换成 promise API
 */
Promise.promisifyAll(request);


var Kuaipan = {};


/**
 * 请求快盘 api 时需要的oauth 参数, 构建请求的url
 * @param baseuri
 * @param params
 * @param tokenserect
 * @returns {string}
 */
Kuaipan.createOauthUrl = function (baseuri, params, tokenserect) {
  var oauth_param = {};
  var _temp = [];
  var obj = {
    oauth_callback: config.kuaipan.oauth_callback,
    oauth_consumer_key: config.kuaipan.consumer_key,
    oauth_nonce: Math.random().toString(36).slice(2, 10) + '',
    oauth_signature_method: config.kuaipan.oauth_signature_method,
    oauth_timestamp: (new Date().getTime() + '').slice(0, 10) * 1,
    oauth_version: config.kuaipan.oauth_version
  };

  for (var key in obj) {
    var _obj = {};
    _obj[key] = obj[key];
    _temp.push(_obj);
  }
  if (params) {
    _temp = _temp.concat(params);
  }

  _temp.sort(function (a, b) {
    return Object.keys(a) > Object.keys(b);
  });
  _temp.map(function (item, i) {
    _.extend(oauth_param, item);
  });
  if (!tokenserect) {
    tokenserect = '';
  }

  var base_string = 'GET' + '&' +
    encodeURIComponent(baseuri) + '&' +
    encodeURIComponent(querystring.stringify(oauth_param));
  oauth_param.oauth_signature = crypto.createHmac('sha1', config.kuaipan.consumer_secret + '&' + tokenserect).update(base_string).digest('base64');

  var url = baseuri + '?' + querystring.stringify(oauth_param);
  console.log(url);
  return url;

};

/**
 * 获取临时 token
 * @returns {string}
 */
Kuaipan.getRequestToken = function () {
  var baseuri = config.kuaipan.url.requestToken;
  var url = this.createOauthUrl(baseuri);
  return request.getAsync(url);
};


/**
 * 获取最终访问的 token
 * @param token
 * @param tokenserect
 * @param verifier
 * @returns {string}
 */
Kuaipan.getAccessToken = function (token, tokenserect, verifier) {
  var base_uri = config.kuaipan.url.accessToken;
  var url = this.createOauthUrl(base_uri, [{
    oauth_token: token
  }, {
    oauth_verifier: verifier
  }], tokenserect);
  return request.getAsync(url);
};

/**
 * 获取用户信息
 * @param token
 * @param tokenserect
 * @returns {string}
 */
Kuaipan.getAccountInfo = function (token, tokenserect) {
  var base_uri = config.kuaipan.url.account_info;
  var url = this.createOauthUrl(base_uri, [{
    oauth_token: token
  }], tokenserect);
  return request.getAsync(url);
};

/**
 * 获取文件夹信息
 * @param token
 * @param tokenserect
 * @returns {string}
 */
Kuaipan.getFolderMetadata = function (token, tokenserect) {

  var base_uri = config.kuaipan.url.metadata;
  var url = this.createOauthUrl(base_uri, [{
    oauth_token: token
  }], tokenserect);
  return request.getAsync(url);
};

module.exports = Kuaipan;
