var express = require('express');
var router = express.Router();
var db = require('../models');
var QnUtil = require('./lib/qiniu');

module.exports = function (app) {
  app.use('/api/qiniu', router);
};


router.get('/token', function (req, res, next) {
  var token = QnUtil.getToken();
  if (token) {
    res.status(200).json({
      uptoken: QnUtil.getToken()
    });
  } else {
    res.status(500).json({});
  }
});


router.get('/list', function (req, res, next) {
  QnUtil.getFileList('', null, '')
    .then(function (result) {
      res.send(result);
    });
});

