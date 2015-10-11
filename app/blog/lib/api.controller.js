var promise = require('bluebird');
var express = require('express');
var request = require('request');
var router = express.Router();
var KuaiPan = require('./kuaipan');
var db = require('../models');

module.exports = function (app) {
  app.use('/api/blog', router);
};

/**
 * 博客 接口
 */

var Blog = {};

/**
 * 获取首页文章数据
 * @param req
 * @param res
 * @param next
 */
Blog.getPostList = function (req, res, next) {
  db.Article.find({}, function (err, list) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(list);
      res.send(list);
    }
  });
};

/**
 * 单个博文详情
 * @param req
 * @param res
 * @param next
 */
Blog.getArticleDetail = function (req, res, next) {
  var _id = req.params.id;
  console.log(req.params);
  db.Article.findOne({'_id': _id}, function (err, article) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(article);
    }
  });
};

/**
 * 发布新的博文
 * @param req
 * @param res
 * @param next
 */
Blog.createPost = function (req, res, next) {
  var data = req.body;
  // data.content = data.content.replace(/\<\!\-\-\s+more\s+\-\-\>/, '<!--more-->');
  data.abstract = data.content.split(/\<\!\-\-\s*more\s*\-\-\>/)[0];
  var post = db.Article(data);
  post.save(function (err, reply) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(reply);
      res.send(reply);
    }
  });
};

Blog.getCategoryList = function (req, res, next) {
  //db.Article.mapReduce(function(){
  //  emit(this.category, {category: this.cagetory,count:1});
  //}, function(key, values){
  //  var result = {'category':'', 'count': ''};
  //  values.map(function(item, i){
  //    result.count += item.count;
  //    result.category = item.category;
  //  });
  //  return result;
  //}, {
  // 'out': 'aaaa'
  //}).exec(function(){
  //  console.log('----');
  //  console.log(arguments);
  //});
  //console.log('bb');
  //console.log(bb);
  db.Article.distinct('category')
    .exec(function (err, result) {
      res.send(result);
    });
};

// 博客主页数据
router.get('/posts', Blog.getPostList);
// 单个博文
router.get('/posts/:id', Blog.getArticleDetail);

// 添加新的博文
router.post('/posts', Blog.createPost);

router.get('/category', Blog.getCategoryList);

router.get('/tags', function (req, res, next) {
  db.Article.find({}, {tags: 1, _id: 0})
    .then(function (tags) {
      res.send(tags);
    })
    .catch(function (err) {
      console.log(err);
    });
});


/**
 * 快盘相关
 */

/**
 * step1: 获取临时 token
 */
var temp = null;
router.get('/kuaipan/request_token', function (req, res, next) {
  var url = KuaiPan.getRequestToken();
  request(url, function (err, result) {
    var body = JSON.parse(result.body);
    console.log(body);
    temp = body.oauth_token_secret;
    res.send({
      code: result.statusCode,
      body: body
    });
  });
});


//router.post('/kuaipan/authorize_callback', function(req, res, next){
//  console.log('0000000->>>>');
//  console.log(req.body);
//  res.send(req.body);
//});
/**
 *  step2: 用户授权之后跳转, 得到 token
 */
router.get('/kuaipan/authorize_callback', function (req, res, next) {
  console.log(req.query);
  // TODO: 获取 access token
  var oauth_token = req.query.oauth_token;
  var oauth_verifier = req.query.oauth_verifier;
  var oauth_token_secret = temp;
  var url = KuaiPan.getAccessToken(oauth_token, oauth_token_secret, oauth_verifier);
  request(url, function (err, result) {
    res.send(result);
  });
});


router.get('/kuaipan/account_info', function (req, res, next) {

  var url = KuaiPan.getRequestToken();
  request(url, function (err, result) {
    var tmp_body = JSON.parse(result.body);
    console.log(tmp_body);
    var _url = KuaiPan.getAccessToken(tmp_body.oauth_token);
    request(_url, function (err, result) {
      res.send(result);
    });
  });
});
