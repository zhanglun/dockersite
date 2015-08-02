var express = require('express');
var router = express.Router();
var db = require('./../models');
var Controller = require('./../controls');


router.get('/', function(req, res){
<<<<<<< HEAD
	res.end('ToDo!!');
=======
    res.render('todo', {layout: false});
>>>>>>> dev
});

router.get('/:id', function(req, res){
    res.send('user: ' + req.params.id);
});


module.exports = router;