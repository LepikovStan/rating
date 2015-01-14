var http = require('http'),
	url = require('url'),
	express = require('express'),
	app = express();
	
app.set('port', 2000);
app.set('views', __dirname + '/tpl');
app.set('view engine', 'ejs');

http.createServer(app).listen(app.get('port'), function() {
	console.log('server created ' + app.get('port') + ', ' + __dirname);
});

app.get('/', function(req, res, next) {
	res.render('index');
});

app.post('/postform', function(req, res, next) {
	console.log(req.read());
	res.render('index');
});
/*app.use(function(req, res, next) {
	if (req.url == '/') {
		res.end('/tpl/index.html');
	}
});*/