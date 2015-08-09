var express = require('express');
var router = express.Router();
var db = require('../models');


module.exports = function(app) {
    app.use('/todo', router);
};

router.get('/', function(req, res, next) {
    res.render('todo', {layout:false});
});
