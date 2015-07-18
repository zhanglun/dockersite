var express = require('express');
var moment = require('moment');
var mongoose = require('mongoose');

// Constants
var PORT = 80;

var routes = require('./routes/index');
var users = require('./routes/users');

// App
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser('Grover.zhang@mingdao.com'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(errorHandler);

function errorHandler(err, req, res, next) {
        res.status(500);
        res.render('error', {
            error: err
        });
    }
    // error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});







var port = process.env.MONGODB_PORT_27017_TCP_PORT;
var addr = process.env.MONGODB_PORT_27017_TCP_ADDR;
var instance = process.env.MONGODB_INSTANCE_NAME;
var password = process.env.MONGODB_PASSWORD;
var username = process.env.MONGODB_USERNAME;

// 'mongodb://user:pass@localhost:port/database'
mongoose.connect('mongodb://' + username + ':' + password +'@' + addr + ':' + port + '/' + instance);
var Records = mongoose.model('Records', { name: {type: String, default:'any'}, time: {type: Date, default: Date.now} });






















app.listen(PORT);
console.log('Master Running on http://localhost:' + PORT);
