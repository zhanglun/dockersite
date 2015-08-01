
var express = require('express');
var router = express.Router();
var db = require('./../models');
var Controller = require('./../controls');




router.get('/', function(req, res) {
    res.send('Hello world\nExpress with Docker!!!\n Thank DaoCloud!!');
});



router.Todo = require('./todo');
router.Movie = require('./movie');

module.exports = router;