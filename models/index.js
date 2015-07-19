var mongoose = require('mongoose');

process.env.CODE_ENV = process.argv.slice(2)[0];
var env = process.env.CODE_ENV;

if (env == 'dev') {
	mongoose.connect('mongodb://localhost/site-dev');
} else {
    var port = process.env.MONGODB_PORT_27017_TCP_PORT;
    var addr = process.env.MONGODB_PORT_27017_TCP_ADDR;
    var instance = process.env.MONGODB_INSTANCE_NAME;
    var password = process.env.MONGODB_PASSWORD;
    var username = process.env.MONGODB_USERNAME;
    // 'mongodb://user:pass@localhost:port/database'
    mongoose.connect('mongodb://' + username + ':' + password + '@' + addr + ':' + port + '/' + instance);
}


var db = mongoose.connection;

db.on('error', function(err) {
    console.log('database connection failed!: ' + err);
});

db.on('open', function() {
    console.log('database opened!!');
});


exports.Movie = mongoose.model('Movie', require('./movie'));
