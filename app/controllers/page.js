var express = require('express');
var router = express.Router();


module.exports = function (app) {
  app.use('/page', router);
};

router.get('/', function (req, res, next) {
  res.render('demo', {layout: false});
});
