var mongoose = require('mongoose');



/**
 * 环境变量
 */
var env = process.env.NODE_ENV;
var PORT;
var db;
if (env == 'development') {
    console.log('deveploment');
    PORT = 3000;
    mongoose.connect('mongodb://localhost/sitedev');
    db = mongoose.connection;
} else {
    var port = process.env.MONGODB_PORT_27017_TCP_PORT;
    var addr = process.env.MONGODB_PORT_27017_TCP_ADDR;
    var instance = process.env.MONGODB_INSTANCE_NAME;
    var password = process.env.MONGODB_PASSWORD;
    var username = process.env.MONGODB_USERNAME;
    // 'mongodb://user:pass@localhost:port/database'
    mongoose.connect('mongodb://' + username + ':' + password + '@' + addr + ':' + port + '/' + instance);
    db = mongoose.connection;
}

db.on('error', function (err) {
    console.log('database connection failed!: ' + err);
});

db.on('open', function () {
    console.log('database opened!!');
});


exports.Movie = mongoose.model('Movie', require('./movie'));
exports.Todo = mongoose.model('Todo', require('./todo'));