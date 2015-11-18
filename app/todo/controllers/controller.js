var join = require('path').join;
var fs = require('fs');
var express = require('express');
var router = express.Router();

var tplPath = require.resolve('../todo.html');

function renderHtml(req, res, next){
  fs.stat(tplPath, function (err, stat) {
    if (err) {
      return next();
    }
    return res.sendFile(tplPath);
  });
}

function renderFiles(req, res, next){
  var file = req.params.file;
  if (!file) return next();
  var name = req.params.example;
  var path = join(__dirname, '../', name, file);
  fs.stat(path, function (err, stat) {
    if (err) {
      return next();
    }
    return res.sendFile(path);
  });
}


module.exports = function (app) {
  app.use('/todo', router);
};

// 静态文件
router.get('/:example/:file(*)', renderFiles);

// 路由
router.get('/', renderHtml);
router.get('/:category', renderHtml);
router.get('/:category/*', renderHtml);
router.get('/:category/*/*', renderHtml);

