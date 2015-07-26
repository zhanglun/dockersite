var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var db = require('./../models');
var Controller = require('./../controls');


router.get('/', function(req, res){
	res.end('Movie!!');
});


router.get('/movie', function(req, res) {
    console.log(req.query);
    var params = {};
    var queries = req.query;
    Controller.Movie.find(queries, function(err, movie) {
        res.json(movie);
    });
});


router.get('/subject/:id', function(req, res) {
    var params = {
        _id: req.params.id
    };
    Controller.Movie.find(params, function(err, movie) {
        res.json(movie);
    });
});

router.get('/import', function(req, res){
    var dataPath = __dirname.replace(/router/, 'data.csv');
    fs.readFile(dataPath, encoding="utf-8", function(err, data){
        var json = data
        
        json = json.replace(/\}\n\{/ig, '}#-#{');

        var arr = json.split('#-#');

        // arr.shift();

        var test = arr.splice(0, 4);

        db.Movie.create(test, function(err, result){
            console.log(err);
        });

        res.json(200, arr);

    });

});

module.exports = router;