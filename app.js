/**
 * Application server
 */

'use strict'
var express = require('express'),
	favicon = require('serve-favicon'),
	config = require('./config.json'),
	locals = require('./lib/locals'),
	helpers = require('./lib/helpers');

// APP SERVER

var app = express();

app.set('view engine', 'jade');

// allows absolute path in extends for jade
app.locals.basedir = app.get('views');

// statics
app.use(favicon(__dirname + '/assets/favicon.ico'));
app.use('/assets', express.static(__dirname + '/assets'));

// populate helpers
Object.keys(locals).forEach(k => app.locals[k] = locals[k]);

app.get(/^\/(.*)$/, function(req, res) {
	var reqPath = req.params[0];
	if (reqPath === '') reqPath = 'home';

	helpers.lookupData(reqPath, (data) => {
		if (config.livereloadPort)
			data.__livereload = '<script src="//' + req.hostname + ':' + config.livereloadPort + '/livereload.js"></script>';
		else data.__livereload = false;
		data.req = req;
		try {
			res.render(reqPath, data, (err, output) => {
				if (err) res.status(500).end(err.toString());
				else res.end(output);
			});
		}
		catch (e) {
			res.status(404).end('Not found');
		}
	});
});

app.listen(config.appPort);
exports.app = app;