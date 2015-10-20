var promise = require('bluebird');
var express = require('express');
var Moment = require('moment');
//var moment = Moment();
var request = require('request');
var router = express.Router();
var Kuaipan = require('./kuaipan');
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
  console.log(req.params);
  db.Article.findOne({'_id': _id}, function (err, article) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
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
  var abstract = data.content.match(/\s*<!--\s*more\s*-->\s+/);
  if (abstract && abstract.length > 0) {
    data.abstract = abstract[0];
  } else {
    var _temp = data.content.replace(/[^.*]#+.*/g, '');
    data.abstract = _temp.slice(0, 260);
  }

  data.tags = data.tags.split(',');
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


/**
 * 快盘相关
 */

/**
 * step1: 获取临时 token
 */
router.get('/kuaipan/request_token', function (req, res, next) {
  var promise = Kuaipan.getRequestToken();
  promise.then(function (result) {
    result = result[0];
    var body = JSON.parse(result.body);
    req.session.oauth_token_secret = body.oauth_token_secret;
    res.send({
      code: result.statusCode,
      body: body
    });
    //res.send(result);
  })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });
});

/**
 *  step2: 用户授权之后跳转, 得到 token
 */
router.get('/kuaipan/authorize_callback', function (req, res, next) {

  var oauth_token = req.query.oauth_token;
  var oauth_verifier = req.query.oauth_verifier;
  var oauth_token_secret = req.session.oauth_token_secret;
  var promise = Kuaipan.getAccessToken(oauth_token, oauth_token_secret, oauth_verifier);
  promise.then(function (result) {
    result = result[0];
    var body = JSON.parse(result.body);
    req.session.access_token = body.oauth_token;
    req.session.oauth_token_secret = body.oauth_token_secret;
    res.render('oauth');
  })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });
});

/**
 * 获取用户信息
 */
router.get('/kuaipan/account_info', function (req, res, next) {

  var access_token = req.session.access_token;
  var access_token_secret = req.session.oauth_token_secret;
  console.log(res.session);
  var promise = Kuaipan.getAccountInfo(access_token, access_token_secret);
  promise.then(function (result) {
    result = result[0];
    res.send(JSON.parse(result.body));
  });
});

/**
 * 获取应用文件夹信息
 */
router.get('/kuaipan/metadata', function (req, res, next) {

  var access_token = req.session.access_token;
  var access_token_secret = req.session.oauth_token_secret;
  var path = req.query.path || '/';
  var promise = Kuaipan.getFolderMetadata(path, access_token, access_token_secret);
  promise.then(function (result) {
    result = result[0];
    res.send(JSON.parse(result.body));
  });
});

/**
 * 创建文件夹
 */
router.get('/kuaipan/create_folder', function (req, res, next) {

  var access_token = req.session.access_token;
  var access_token_secret = req.session.oauth_token_secret;
  var path = req.query.path;
  if (!path) {
    res.status(403).json({
      code: 403,
      msg: 'no path'
    });
  }
  var promise = Kuaipan.createFolder(path, access_token, access_token_secret);
  promise.then(function (result) {
    result = result[0];
    res.status(200).json(JSON.parse(result.body));
  });
});

/**
 * 下载文件
 */
router.get('/kuaipan/download_file', function (req, res, next) {

  var access_token = req.session.access_token;
  var access_token_secret = req.session.oauth_token_secret;
  var path = req.query.path;
  var file_type = path.match(/\.[^\.]+$/)[0].slice(1);
  if (!path) {
    res.status(403).json({
      code: 403,
      msg: 'no path'
    });
  }
  var promise = Kuaipan.downloadFile(path, access_token, access_token_secret);
  promise.then(function (result) {
    result = result[0];
    return result.request.uri.href;
  })
    .then(function (href) {
      request({
        url: href,
        jar: true,
        encoding: null
      }, function (err, file) {
        // TODO: 已经拿到文件实体 ，待完善
        if (file_type == 'md') {
          res.contentType('text/plain; charset=utf-8');
        } else {
          res.contentType('image/' + file_type + '; charset=utf-8');
        }
        console.log(file.body);
        res.send(file.body);
      });
    });
});

/**
 * 上传文件
 */
router.post('/kuaipan/upload_file', function (req, res, next) {

  var access_token = req.session.access_token;
  var access_token_secret = req.session.oauth_token_secret;
  var file = req.body.file;
  var path = req.body.path;
  file = new Buffer(file, 'binary');
  console.log(file);
  var promise = Kuaipan.uploadFile(file, path, access_token, access_token_secret);
  promise.then(function (url) {
    // post file
    var filename = path.match(/\b\w*\.\b\w*$/)[0];
    var reqForm = request.post(url, function (err, result) {

      res.status(result.statusCode).send(result.body);
    });
    var form = reqForm.form();
    form.append('file', file, {
      filename: filename,
      contentType: 'text/plain'
    });
  });

});

router.get('/kuaipan/thumbnail', function (req, res, next) {

  var access_token = req.session.access_token;
  var access_token_secret = req.session.oauth_token_secret;
  var path = req.query.path;
});
