var express = require('express');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var router = express.Router();


var config = require('./config');

process.env.CODE_ENV = process.argv.slice(2)[0];

console.log(process.env.CODE_ENV);
// Constants
if (process.env.CODE_ENV == 'dev') {
    var PORT = 3000;
} else {
    var PORT = 80;
}

// App

var router = require('./router');

var app = express();

app.use('/', router);


var port = process.env.MONGODB_PORT_27017_TCP_PORT;
var addr = process.env.MONGODB_PORT_27017_TCP_ADDR;
var instance = process.env.MONGODB_INSTANCE_NAME;
var password = process.env.MONGODB_PASSWORD;
var username = process.env.MONGODB_USERNAME;

if(process.env.CODE_ENV == 'dev'){

}else{
  // 'mongodb://user:pass@localhost:port/database'
  mongoose.connect('mongodb://' + username + ':' + password + '@' + addr + ':' + port + '/' + instance);
}

var Records = mongoose.model('Records', {
    name: {
        type: String,
        default: 'any'
    },
    time: {
        type: Date,
        default: Date.now
    }
});

app.get('/', function(req, res) {
    //res.send('Hello world\n');

    var record = new Records({
        name: req.ip
    });
    record.save(function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log('save');
        }
    });
    Records.find(function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            var out = '<table border="1" align="center" width="50%"> <thead> <tr> <th> IP </th>  <th> time </th></tr></thead> <tbody> ';
            for (var i = 0, l = docs.length; i < l; i++) {
                out = out + '<tr> <th>' + docs[i].name + '</th> <th>' + moment(docs[i].date).format() + '</th></tr>';
            }
            out = out + '</tbody> </table>'
            res.send(out);
        }
    });

});


app.get('/demo', function(req, res) {
    res.send('hhahahah!!!!!!!!!test');
});


app.get('/drop', function(req, res) {
    Records.remove({}, function(err) {
        if (err) {
            console.log(err);
            res.send('drop collection Records failed');
        } else {
            res.send('drop collection Records success at:' + new Date());
            console.log('drop collection Records success');
        }
    });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
