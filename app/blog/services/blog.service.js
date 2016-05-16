var db = require('../models');
var Moment = require('moment');
var marked = require('marked');

var Blog = {};

function convertObjectIdToId(target) {
  if (Array.isArray(target)) {
    target = target.map(function(item) {
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

Blog.getArticleList = function() {
  return db.Article.find({}, {content: 0}).sort({ 'update_time': -1 }).execAsync()
    .then(function(list) {
      list = list.map(function(item) {
        item = item.toObject();
        item.create_time = Moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
        item.update_time = Moment(item.update_time).format('YYYY-MM-DD HH:mm:ss');
        return item;
      });
      list = convertObjectIdToId(list);
      return list;
    });
};


Blog.getArticleDetail = function(id) {
  return db.Article.findOneAsync({ '_id': id })
    .then(function(article) {
      article = article.toObject();
      article.create_time = Moment(article.create_time).format('YYYY-MM-DD HH:mm:ss');
      article.update_time = Moment(article.update_time).format('YYYY-MM-DD HH:mm:ss');
      article = convertObjectIdToId(article);
      return article;
    })
    .catch(function(err) {
      console.log(err);
    });
};

Blog.createArticle = function(article) {
  article.digest = marked(article.content).replace(/<\/?[^>]*>/ig, '').slice(0, 150);
  var newArticle = db.Article(article);
  return newArticle.saveAsync()
    .then(function(result) {
      article = convertObjectIdToId(result[0]);
      return article;
    })
    .catch(function(err) {
      return err;
    });
};

Blog.modifyArticle = function(id, update) {
  update.content ? update.digest = marked(update.content).replace(/<\/?[^>]*>/ig, '').slice(0, 150) : null;
  return db.Article.findByIdAndUpdateAsync(id, update, { new: true })
    .then(function(article) {
      article = convertObjectIdToId(article);
      return article;
    })
    .catch(function(err) {
      console.log(err);
      return err;
    });
};

Blog.deleteArticle = function(id) {
  return db.Article.findOneAndRemoveAsync({ _id: id })
    .then(function(article) {
      article = convertObjectIdToId(article);
      return article;
    })
    .catch(function(err) {
      return err;
    });
};


module.exports = Blog;
