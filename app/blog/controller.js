var join = require('path').join;
var fs = require('fs');
var express = require('express');
var router = express.Router();

var tplPath = require.resolve('./blog.html');


module.exports = function (app) {
  app.use('/blog', router);
};

router.get('/', function (req, res, next) {
  fs.stat(tplPath, function (err, stat) {
    if (err) {
      return next();
    }
    return res.sendFile(tplPath);
  });
});