var express = require('express');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var exphbs = require('express-handlebars');
var config = require('./config');



// App

var router = require('./router');

var app = express();

app.use('/', router.Index);
// template engine
var hbs = exphbs.create({
    //defaultLayout: 'layout',
    //helpers: helpers,
    extname: '.html'
});

app.engine('html', hbs.engine);
app.set('view engine', 'html');

app.use('/', router.Index);
app.use('/todo', router.Todo);
app.use('/movie', router.Movie);





/**
 * 环境变量
 */
process.env.CODE_ENV = process.argv.slice(2)[0];
console.log(process.env.CODE_ENV);

var PORT;
if (process.env.CODE_ENV == 'dev') {
    PORT = 3000;
} else {
    PORT = 80;
    app.enable('view cacahe');
}


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
        console.log('aasdfadsf');
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



app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
