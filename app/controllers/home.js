var express = require('express');
var router = express.Router();
var path= require('path');


module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function (req, res, next) {
  console.dir(req.cookies);
  if(req.cookies.isVisit){
    console.log(req.cookies);
    res.render('index', {
      message: 'welcome back!' + req.sessionID
    });
  }else{
    res.cookie('isVisit', 1, {maxAge: 30 * 1000});
    res.render('index', {
      message: 'welcome! freshman！' + req.sessionID
    });
  }
});

router.get('/:example/*', function(req, res){
  var name = req.params.example;
  console.log(name);
  res.sendFile(path.join(__dirname, name, 'index.html'));
});
