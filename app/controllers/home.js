var express = require('express');
var router = express.Router();
var path= require('path');


module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Generator-Nodescaffold MVC'
    });
});

router.get('/:example/*', function(req, res){
  var name = req.params.example;
  console.log(name);
  res.sendFile(path.join(__dirname, name, 'index.html'));
});
