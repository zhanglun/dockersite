var express  = require('express');
var router = express.Router();
var movieService = require('../services/movie.service');

module.exports = function(app) {
  app.use('/moviemaster/api', router);
};

router.get('/movies', function(req, res, next) {
  var query = req.query || {};
  movieService.getList(query)
  .then(function (data) {
    return res.status(200).json(data);
  })
});
