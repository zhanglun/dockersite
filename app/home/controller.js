var express = require('express');
var router = express.Router();
var path = require('path');

var tplPath = require.resolve('./home.handlebars');
var exphbs = require('express-handlebars').create();


module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  console.dir(req.cookies);
  if (req.cookies.isVisit) {
    console.log(req.cookies);
    var promise = exphbs.render(tplPath, {
      message: 'welcome back!' + req.sessionID
    });
    promise.then(function (str) {
      res.write(str);
      res.end();
    });
  } else {
    res.cookie('isVisit', 1, {maxAge: 30 * 1000});
    console.log(req.cookies);
    var promise = exphbs.render(tplPath, {
      message: 'welcome! freshman！' + req.sessionID
    });
    promise.then(function (str) {
      res.write(str);
      res.end();
    });
  }
});

//router.get('/:example/*', function (req, res) {
//  var name = req.params.example;
//  console.log(name);
//  res.sendFile(path.join(__dirname, name, 'index.html'));
//});
