var express = require('express');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var exphbs = require('express-handlebars');


var config = require('./config');



// App

var router = require('./router');

var app = express();

// template engine
var hbs = exphbs.create({
    defaultLayout: 'layout',
    //helpers: helpers,
    extname: '.html'
});

app.engine('html', hbs.engine);
app.set('view engine', 'html');

app.use('/', router);
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

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
