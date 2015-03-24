var express = require('express'),
	livereload = require('livereload'),
	path = require('path'),
	fs = require('fs'),
	favicon = require('serve-favicon'),
	config = require('./config.default.json');

try {
	customConfig = require('./config.json');
	Object.keys(customConfig).forEach(function(k) {
		config[k] = customConfig[k];
	});
}
catch(e) { console.log('Using default config file only'); }

var app = express(),
	livereloadServer = livereload.createServer({
		port: config.livereloadPort,
		exts: ['css', 'js'],
		interval: 100
	});

livereloadServer.watch(__dirname + '/public');

app.set('view engine', 'jade');
app.use(favicon(__dirname + '/assets/favicon.ico'));
app.use('/assets', express.static(__dirname + '/public'));
app.use('/assets/static', express.static(__dirname + '/assets/static'));
app.use('/assets/fonts', express.static(__dirname + '/assets/fonts'));

app.get(/^\/(.*)$/, function(req, res) {
	var reqPath = req.params[0];
	if (reqPath === '') reqPath = 'home';
	
	fs.exists('./data/' + reqPath + '.js', function(exists) {
		var data = {};
		if (exists) {
			data = require('./data/' + reqPath);
			delete require.cache[require.resolve('./data/' + reqPath)];
		}
		data.__livereload = '//' + req.hostname + ':' + config.livereloadPort + '/livereload.js';
		data.__css = '/assets/main.css';
		data.__js = '/assets/main.js';
		data.static = function(path) {
			return '/assets/static/' + path;
		};
		try {
			res.render(reqPath, data, function(err, output) {
				if (err) {
					res.status(404).end(err.toString());
				}
				else {
					res.end(output);
				}
			});
		}
		catch (e) {
			res.status(404).end('Not found');
		}
	});
});

app.listen(config.appPort);