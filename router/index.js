
var express = require('express');
var router = express.Router();

router.get('/routers', function(req, res){
	res.send('Routers!!!!');
});

module.exports = router;