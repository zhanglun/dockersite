var promise = require('bluebird');
var express = require('express');
var Moment = require('moment');
//var moment = Moment();
var request = require('request');
var router = express.Router();
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
  db.Article.find({}).sort({utime: -1}).exec(function (err, list) {
    if (err) {
      res.send(err);
    } else {
      list = list.map(function (item) {
        item = item.toObject();
        item.ctime = Moment(item.ctime).format('YYYY-MM-DD HH:mm:ss');
        item.utime = Moment(item.utime).format('YYYY-MM-DD HH:mm:ss');
        return item;
      });
      console.log(list[0]);
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
  db.Article.findOne({'_id': _id}, function (err, article) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      if (!article) {
        res.status(404).json(article);
        return;
      }
      article = article.toObject();
      article.ctime = Moment(article.ctime).format('YYYY-MM-DD HH:mm:ss');
      article.utime = Moment(article.utime).format('YYYY-MM-DD HH:mm:ss');
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
  data.content = data.content.replace(/\r/g, '');
  var abstract = data.content.split(/\s*<!--\s*more\s*-->\s+/);
  if (abstract && abstract.length > 1) {
    data.abstract = abstract[0];
  } else {
    var _temp = data.content.replace(/[^.*]#+.*/g, '');
    data.abstract = _temp.slice(0, 160);
  }

  var post = db.Article(data);
  post.save(function (err, reply) {
    if (err) {
      res.send(err);
    } else {
      res.send(reply);
    }
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

