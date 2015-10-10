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
Blog.getPostList = function(req, res, next){
  db.Article.find({}, function(err, reply) {
    console.log(reply);
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(reply);
      res.send(reply);
    }
  });
};

/**
 * 发布新的博文
 * @param req
 * @param res
 * @param next
 */
Blog.createPost = function(req, res, next) {
  var data = req.body;
  var post = db.Article(data);
  post.save(function(err, reply) {
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

// 添加新的博文
router.post('/posts', Blog.createPost);
