var express = require('express');
var router = express.Router();
var db = require('../models');

module.exports = function(app) {
    app.use('/chatroom', router);
};

router.get('/', function(req, res, next) {
    res.render('chat', {
        layout: false
    });
});

router.get('/aa/sss', function(req, res, next) {
  res.render('chat', {
    layout: false
  });
});
