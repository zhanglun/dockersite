var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Express');
});

router.get('/demo', function(){
	res.send('Demo');
});

router.get('/hahah', function(){
	res.send('Hahahahah!!');
});
module.exports = router;
