var promise = require('bluebird');
var express = require('express');
var router = express.Router();
var db = require('../models.js');

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


// 博客主页数据
router.get('/posts', Blog.getPostList);
// 单个博文
router.get('/posts/:id', Blog.getArticleDetail);

// 添加新的博文
router.post('/posts', Blog.createPost);


router.get('/tags', function (req, res, next) {
  db.Article.find({}, {tags: 1, _id: 0}, function (err, tags) {
    console.log(tags);
    res.send(tags);
  });
});
