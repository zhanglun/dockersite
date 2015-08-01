var express = require('express');
var router = express.Router();
var db = require('./../models');
var Controller = require('./../controls');


router.get('/', function(req, res){
    Controller.Movie.find({}, function(movie){
        res.send(movie);
    });
});

module.exports = router;
