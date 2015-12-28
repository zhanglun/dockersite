var bluerobin = {
  Key: 'f70c047a8c12ccde84a1608b1daf987c',
  Secret: '7e3e3817be41c13c'
};
// https://www.flickr.com/services/apps/create/noncommercial/?
//
var express = require('express');
var router = express.Router();
var db = require('../models');


module.exports = function(app){
  app.use('/api/flickr', router);
};
