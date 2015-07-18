var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.query);
    res.render('index', {
        title: 'Express'
    });
});

// will match acd and abcd
router.get('/ab?cd', function(req, res) {
    res.send('ab?cd');
});

// will match abcd, abbcd, abbbcd, and so on
router.get('/ab+cd', function(req, res) {
    res.send('ab+cd');
});

// will match abcd, abxcd, abRABDOMcd, ab123cd, and so on
router.get('/ab*cd', function(req, res) {
    res.send('ab*cd');
});


router.get('/demo/socket', function(req, res){
	res.render('socket', {
		title: 'Socket'
	});
});

router.get('/demo/session', function(req, res) {
    var sess = req.session;
    if (sess.views) {
        sess.views++;
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>views: ' + sess.views + '</p>');
        res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
        res.end();
    } else {
        sess.views = 1;
        res.end('welcome to the session demo. refresh!');
    }
});


router.get('/demo/userstatus', function(req, res){
    console.log('req.cookies');
    req.session.roomId = req.cookies.room_id;
    req.session.user_status = req.cookies.user_status;
    res.render('status');
});

router.post('/api/login', function(req, res){
    console.log(req.body);
    req.session.username = req.body.username;
    res.json(200, {
        code: 'success!!'
    });
});





// router.get('/ip/record', function (req, res) {
//   //res.send('Hello world\n');

//   var record = new Records({ name: req.ip });
//   record.save(function (err) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log('save');
//     }
//   });
//   Records.find(function (err, docs) {
//     if(err) {
//       console.log(err);
//     } else {
//       var out = '<table border="1" align="center" width="50%"> <thead> <tr> <th> IP </th>  <th> time </th></tr></thead> <tbody> ';
//       for (var i = 0,l = docs.length; i < l; i++){
//         out = out + '<tr> <th>' + docs[i].name + '</th> <th>' + moment(docs[i].date).format() + '</th></tr>';
//       }
//       out = out + '</tbody> </table>'
//       res.send(out);
//     }
//   });

// });

// app.get('/ip/drop', function (req, res) {
//   Records.remove({}, function(err) {
//     if(err) {
//       console.log(err);
//       res.send('drop collection Records failed');
//     } else {
//       res.send('drop collection Records success');
//       console.log('drop collection Records success');
//     }
//   });
// });




module.exports = router;
