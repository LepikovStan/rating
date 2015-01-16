
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    path = require('path'),
    http = require('http'),
    app = express();

app.set('port', 3000);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

app.use(function(req, res, next) {
  if (req.url == '/') {
    res.end('hj')
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  if (req.url == '/gt') {
    res.end('gtasd')
  } else {
    next();
  }
});

// Configuration

/*app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);*/

