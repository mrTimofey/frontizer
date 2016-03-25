/**
 * Application server
 */

'use strict'
var fs = require('fs'),
	express = require('express'),
	favicon = require('serve-favicon'),
	locals = require('../lib/locals'),
	helpers = require('../lib/helpers'),
	livereload = require('../lib/livereload'),
	exec = require('child_process').exec;

module.exports = function(options, home) {
	locals.init('app');

	options = options || {};
	home = home || process.cwd();

	// APP SERVER

	var app = express(),
		config = require(home + '/config.json');

	app.set('views', home + '/views');
	app.set('view engine', 'jade');
	app.set('view cache', false);

	// statics
	let faviconFile = fs.existsSync(home + '/favicon.ico') ?
		(home + '/favicon.ico') : (__dirname + '/../favicon.ico');

	app.use(favicon(faviconFile));
	app.use('/assets', express.static(home + '/assets'));

	// populate helpers
	Object.keys(locals).forEach(k => app.locals[k] = locals[k]);

	// allows absolute path in 'extends' for jade
	app.locals.basedir = app.get('views');

	app.get(/^\/(.*)$/, (req, res) => {
		var reqPath = req.params[0];
		if (reqPath === '') reqPath = 'home';

		helpers.lookupData(reqPath, (data) => {
			if (config.livereloadPort)
				data.__livereload ='<script src="//' +
					req.hostname + ':' + config.livereloadPort + '/livereload.js"></script>';
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

	// LIVERELOAD SERVER

	if (config.livereloadPort) livereload(config.livereloadPort, home + '/assets/compiled');

	// WATCH SOURCES

	[{
		files: config.js,
		command: 'watchify assets/js/{input} ' + helpers.browserifyArgs.join(' ') + ' -o assets/compiled/{output}.js'
	}, {
		files: config.styles,
		command: 'stylus assets/styles/{input} ' + helpers.stylusArgs.join(' ') +
		' -m --sourcemap-root assets -w -o assets/compiled/{output}.css'
	}].forEach(watch => {
		var command = watch.command;
		watch.files.forEach(file => {
			var watcher = exec(command
				.replace('{input}', file)
				.replace('{output}', file.split('.').slice(0, -1)));

			watcher.stdout.pipe(process.stdout);
			watcher.stderr.pipe(process.stderr);
		});
	});
};