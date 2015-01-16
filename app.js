
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    path = require('path'),
    http = require('http'),
    bodyParser  = require('body-parser'),
    app = express(),
    office = require('office');

app.set('port', 3000);
app.set('views', __dirname + '/tpl');
app.set('view engine', 'ejs');

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

app.use(bodyParser());
//app.use(express.cookieParser());

app.get('/', function(req, res, next) {

  res.render('index');
});

app.post('/postform', function(req, res, next) {
  //res.render('index');
  console.log(req.body);

  office.parse('rating.ods', function(err, data) {
    console.log(data.sheets);
  });
  res.end();
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

