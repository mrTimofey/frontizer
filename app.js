var express = require('express'),
	handlebars = require('express3-handlebars'),
	path = require('path'),
	fs = require('fs');

var app = express();

app.engine('htm', handlebars({ defaultLayout: 'main', extname: '.htm' }));
app.set('view engine', 'htm');
app.use(express.static(__dirname + '/public'));

app.get(/^\/(.*)$/, function(req, res) {
	var reqPath = req.params[0];
	if (reqPath === '') reqPath = 'home';
	
	fs.exists('./data/' + reqPath + '.js', function(exists) {
		var data = {};
		if (exists) {
			data = require('./data/' + reqPath);
			delete require.cache[require.resolve('./data/' + reqPath)];
		}
		data.__livereload = '<script src="//localhost:35729/livereload.js"></script>';
		res.render(reqPath, data);
	});
});

module.exports = app;