var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var ejs = require('ejs');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);



module.exports = function (app, config) {

  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  // app.set('views', config.root + '/app/views');
  // app.set('view engine', 'ejs');
  app.set('superSecert', config.secert);

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(session({
    store: new RedisStore({
      host: config.redis.host,
      port: config.redis.port,
      pass: config.redis.password
    }),
    //cookie: { secure: true },
    resave: true,
    saveUninitialized: true,
    secret: 'zhanglun daocloud!'
  }));

  app.use(compress());
  app.use(express.static(config.root + '/src'));
  app.use(methodOverride());
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, x-access-token');
    res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    if(req.method === 'OPTIONS') {
      res.status(200).json({});
    }else {
      next();
    }
  });



  var controllers = glob.sync(config.root + "{/app/**/controllers/*.js,/app/controllers/*.js}");
  controllers.forEach(function (controller) {
    require(controller)(app);
  });


  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });


  if (app.get('env') === 'production') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      // throw err;
      res.send({
       message: err.message,
       error: err,
       title: 'error'
      });

    });
  }

  // app.use(function (err, req, res, next) {
  //   res.status(err.status || 500);
  //   res.send({
  //     message: err.message,
  //     error: err,
  //     title: 'error'
  //   });
  // });
};
