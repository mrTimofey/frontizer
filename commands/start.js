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
	options = options || {};
	home = home || process.cwd();

	var config = require(home + '/config.json'),
		browserifyArgs = config.browserify || [],
		stylusArgs = config.stylus || [];

	locals.init('app', home, config);

	// APP SERVER
	if (config.appPort) {
		var app = express();

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

		// indented html output
		if (options.pretty) app.locals.pretty = '\t';

		// serve api
		app.use(/^\/api\/(.*)$/, (req, res) => {
			var src = home + '/api/' + req.params[0];
			fs.exists(src + '.js', exists => {
				if (!exists) return res.status(404).end('API not found: ' + src);
				try {
					let api = require(src);
					delete require.cache[require.resolve(src)];
					if (typeof api === 'function') return api(req, res);
					else return res.json(api);
				}
				catch (e) {
					res.status(500).end(e.toString());
				}
			});
		});

		// serve views
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
	}

	// LIVERELOAD SERVER

	if (config.livereloadPort) livereload(config.livereloadPort, home + '/assets/compiled');

	// WATCH SOURCES

	[{
		files: config.js,
		command: __dirname + '/../node_modules/.bin/watchify assets/js/{input} ' +
			helpers.browserifyArgs.join(' ') +
			browserifyArgs.join(' ') +
			' -o assets/compiled/{output}.js'
	}, {
		files: config.styles,
		command: __dirname + '/../node_modules/.bin/stylus assets/styles/{input} ' +
			helpers.stylusArgs.join(' ') +
			stylusArgs.join(' ') +
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