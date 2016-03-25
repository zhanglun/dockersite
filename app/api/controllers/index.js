var express = require('express');
var router = express.Router();

module.exports = function(app){
  app.use('/api', router);
};

router.get('/', function(req, res, next){
  res.send('Hello! The API is at http://localhost:' + '1234' + '/api');
});

router.get('/test', function(req, res, next){
  res.json({a:123});
});