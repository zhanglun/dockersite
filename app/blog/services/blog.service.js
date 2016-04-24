var db = require('../models');
var Moment = require('moment');

var Blog = {};

function convertObjectIdToId(target) {
  if (Array.isArray(target)) {
    target = target.map(function (item) {
      item.id = item._id;
      delete item._id;
      delete item.__v;
      return item
    });
  } else {
    target.id = target._id;
    delete target.__v;
    delete target._id;
  }
  return target;
}

Blog.getArticleList = function () {
  return db.Article.find({}, {title: 1, tags: 1, category:1}).execAsync()
    .then(function (list) {
      list = list.map(function (item) {
        item = item.toObject();
        item.ctime = Moment(item.ctime).format('YYYY-MM-DD HH:mm:ss');
        item.utime = Moment(item.utime).format('YYYY-MM-DD HH:mm:ss');
        return item;
      });
      list = convertObjectIdToId(list);
      return list;
    });
};


Blog.getArticleDetail = function (id) {
  return db.Article.findOneAsync({'_id': id})
    .then(function (article) {
      article = article.toObject();
      article.ctime = Moment(article.ctime).format('YYYY-MM-DD HH:mm:ss');
      article.utime = Moment(article.utime).format('YYYY-MM-DD HH:mm:ss');
      article = convertObjectIdToId(article);
      return article;
    })
    .catch(function (err) {
      console.log(err);
    });
};

Blog.createArticle = function (article) {
  var newArticle = db.Article(article);
  return newArticle.saveAsync()
    .then(function (result) {
      // result -> [article, 1]
      article = convertObjectIdToId(result[0]);
      return article;
    })
    .catch(function (err) {
      return err;
    });
};

Blog.modifyArticle = function (id, update) {
  return db.Article.findByIdAndUpdateAsync(id, update, {new: true})
    .then(function (article) {
      article = convertObjectIdToId(article);
      return article;
    })
    .catch(function (err) {
      console.log(err);
      return err;
    });
};

Blog.deleteArticle = function (id) {
  return db.Article.findOneAndRemoveAsync({_id: id})
    .then(function (article) {
      article = convertObjectIdToId(article);
      return article;
    })
    .catch(function (err) {
      return err;
    });
};


module.exports = Blog;
