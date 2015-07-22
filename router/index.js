var express = require('express');
var router = express.Router();
var db = require('./../models');
var Controller = require('./../controls');

router.get('/', function(req, res) {
    res.send('Hello world\nExpress with Docker!!!\n Thank DaoCloud!!');
});

router.get('/routers', function(req, res) {
    res.send('Routers!!!!');
});

router.get('/movies', function(req, res) {
    console.log(req.query);
    var params = {};
    var queries = req.query;
    Controller.Movie.find(queries, function(err, movie) {
        res.json(movie);
    });
});


router.get('/movie/:id', function(req, res) {
    var params = {
        _id: req.params.id
    };
    Controller.Movie.find(params, function(err, movie) {
        res.json(movie);
    });
});



module.exports = router;
