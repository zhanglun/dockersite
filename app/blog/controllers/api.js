var promise = require('bluebird');
var express = require('express');
var Moment = require('moment');
var QnUtil = require('./lib/qiniu.js');
var request = require('request');
var router = express.Router();
var db = require('../models');
var blogService = require('../services/blog.service.js');

module.exports = function (app) {
  app.use('/blog/api', router);
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
Blog.getArticleList = function (req, res, next) {
  blogService.getArticleList()
    .then(function(list){
      console.log(list);
      return res.status(200).json(list);
    });
};

/**
 * 单个博文详情
 * @param req
 * @param res
 * @param next
 */
Blog.getArticleDetail = function (req, res, next) {
  blogService.getArticleDetail(id)
    .then(function(article){
      res.send(article);
    });

};

/**
 * 发布新的博文
 * @param req
 * @param res
 * @param next
 */
Blog.createArticle = function (req, res, next) {
  // var data = req.body;
  // data.content = data.content.replace(/\r/g, '');
  // var abstract = data.content.split(/\s*<!--\s*more\s*-->\s+/);
  // if (abstract && abstract.length > 1) {
  //   data.abstract = abstract[0];
  // } else {
  //   var _temp = data.content.replace(/[^.*]#+.*/g, '');
  //   data.abstract = _temp.slice(0, 160);
  // }
  var data = req.body;
  if(!data.title){
    return res.status(400).json([]);
  }
  var article = db.Article(data);
  blogService.createArticle(article)
    .then(function(article){
      return res.status(200).json(article);
    })
    .catch(function(err){
      return res.status(500).json(err.message)
    });
};

Blog.getCategoryList = function (req, res, next) {
  db.Article.aggregate([{
    $group: {
      _id: '$category',
      count: {$sum: 1}
    }
  }])
    .exec(function (err, result) {
      result.map(function (item, i) {
        item['category'] = item['_id'];
        delete item['_id'];
        return item;
      });
      res.send(result);
    });
};

// 博客主页数据
router.get('/articles', Blog.getArticleList);
// 单个博文
router.get('/articles/:id', Blog.getArticleDetail);

// 添加新的博文
router.post('/articles', Blog.createArticle);

// router.get('/category', Blog.getCategoryList);

// router.get('/tags', function (req, res, next) {
//   db.Article.find({}, {tags: 1, _id: 0})
//     .then(function (tags) {
//       res.send(tags);
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
// });