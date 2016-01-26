var bluerobin = {
  Key: 'f70c047a8c12ccde84a1608b1daf987c',
  key: '6fd3c5077b9c0265998d2a42b0ce4906',
  Secret: '7e3e3817be41c13c',
  Secret: 'c85933f185da0555'
};
// https://www.flickr.com/services/apps/create/noncommercial/?
//
var express = require('express');
var router = express.Router();
var db = require('../models');
var Flickr = require('flickrapi');


module.exports = function(app){
  app.use('/api/flickr', router);
};

router.get('/test', function(req, res, next){
  var flickr = new Flickr({
    api_key: bluerobin.Key
  });
});
