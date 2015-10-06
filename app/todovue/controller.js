var join = require('path').join;
var fs = require('fs');
var express = require('express');
var router = express.Router();

var tplPath = require.resolve('./todo.html');


module.exports = function (app) {
  app.use('/todovue', router);
};

router.get('/', function (req, res, next) {
  fs.stat(tplPath, function (err, stat) {
    if (err) {
      return next();
    }
    return res.sendFile(tplPath);
  });
});

//router.get('/:category', function(req, res){
//  console.log('redirect');
//  res.redirect('/todovue/' + req.params.category + '/');
//});

/**
 *
 */
router.get('/:category', function (req, res, next) {
  fs.stat(tplPath, function (err, stat) {
    if (err) {
      return next();
    }
    return res.sendFile(tplPath);
  });
});

router.get('/:example/:file(*)', function (req, res, next) {
  var file = req.params.file;
  if (!file) return next();
  var name = req.params.example;
  var path = join(__dirname, name, file);
  fs.stat(path, function (err, stat) {
    if (err) {
      return next();
    }
    return res.sendFile(path);
  });
});
