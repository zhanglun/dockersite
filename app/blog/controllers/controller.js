var join = require('path').join;
var fs = require('fs');
var express = require('express');
var router = express.Router();

var db = require('../models');

var tplPath = require.resolve('../views/app.html');

function renderHtml(req, res, next) {
  fs.stat(tplPath, function (err, stat) {
    if (err) {
      return next();
    }
    return res.sendFile(tplPath);
  });
}

function renderFiles(req, res, next) {
  var file = req.params.file;
  console.log(file);
  if (!file) {
    return next();
  }
  var name = req.params.example;
  var path = join(__dirname, '../', name, file);
  console.log(path);
  fs.stat(path, function (err, stat) {
    if (err) {
      return next();
    }
    return res.sendFile(path);
  });
}


module.exports = function (app) {
  app.use('/blog', router);
};


// 静态文件
router.get('/:example/:file(*)', renderFiles);

// 路由
router.get('/admin', function(req, res, next){
  res.send('Hi, Admin!');
});

router.get('/app', function(req, res, next){
  // res.send('app !');
  renderHtml(req, res);
});

router.get('/app/*', renderHtml);
// router.get('/:category', renderHtml);
// router.get('/:category/*', renderHtml);
// router.get('/:category/*/*', renderHtml);
