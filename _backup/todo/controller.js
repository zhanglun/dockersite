var express = require('express');
var router = express.Router();
var db = require('./models.js');

var tplPath = require.resolve('./todo.handlebars');
var exphbs = require('express-handlebars').create();


module.exports = function (app) {
  app.use('/todo', router);
};

router.get('/', function (req, res, next) {
  var promise = exphbs.render(tplPath, {title: 'This is the title!'});
  promise.then(function (str) {
    res.write(str);
    res.end();
  });
});


router.get('/:sub', function (req, res, next) {
  var promise = exphbs.render(tplPath, {title: 'This is the title!'});
  promise.then(function (str) {
    res.write(str);
    res.end();
  });
});

