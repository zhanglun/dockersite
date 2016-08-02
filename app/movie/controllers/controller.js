var express = require('express');
var router = express.Router();

module.exports = function(app) {
  app.use('/moviemaster', router);
};

router.get('/', function(req, res, next) {
  res.send('Hello! The MovieMaster API is at http://localhost:' + '1234' + '/moviemaster');
});
