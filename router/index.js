
var express = require('express');
var router = express.Router();
var db = require('./../models');
var Controller = require('./../controls');

router.get('/', function(req, res) {
    res.send('Hello world\nExpress with Docker!!!\n Thank DaoCloud!!');
});

router.get('/routers', function(req, res){
	res.send('Routers!!!!');
});

router.get('/movies', function(req, res){
	Controller.Movie.find({}, function(movie){
		console.log(movie);
		res.send(movie);
	});
});
module.exports = router;