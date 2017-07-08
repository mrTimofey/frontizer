/**
 * Application server
 */

'use strict';
const fs = require('fs'),
	express = require('express'),
	favicon = require('serve-favicon'),
	locals = require('../lib/locals'),
	helpers = require('../lib/helpers'),
	livereload = require('../lib/livereload'),
	exec = require('child_process').exec;

module.exports = (options, home) => {
	options = options || { pretty: false };
	home = home || process.cwd();

	let config = require(home + '/config.json'),
		browserifyArgs = config.browserify || [],
		stylusArgs = config.stylus || [];

	locals.init('app', home, config);

	// APP SERVER
	if (config.appPort) {
		const app = express();

		// cors
		if (config.cors) {
			app.use((req, res, next) => {
				res.header('Access-Control-Allow-Origin', '*');
				res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
				next();
			});
		}

		// statics
		const faviconFile = fs.existsSync(home + '/favicon.ico') ?
			(home + '/favicon.ico') : (__dirname + '/../favicon.ico');

		app.use(favicon(faviconFile));
		app.use('/assets', express.static(home + '/' + config.sourcePath));
		app.use('/compiled', express.static(home + '/' + config.destPath));

		// serve api
		if (config.apiPath) {
			app.use(new RegExp(`^\/${config.apiRoot || config.apiPath}\/(.*)$`), (req, res) => {
				const src = home + '/' + config.apiPath + '/' + req.params[0];
				fs.exists(src + '.js', exists => {
					if (!exists) return res.status(404).end('API not found: ' + src);
					try {
						let api = require(src);
						delete require.cache[require.resolve(src)];
						if (typeof api === 'function') return api(req, res);
						else return res.json(api);
					}
					catch (err) {
						res.status(500).end(err.toString());
						console.error('API error in: ' + src);
						console.error(err);
					}
				});
			});
		}

		// serve views
		if (config.viewsPath) {
			app.set('views', home + '/' + config.viewsPath);
			app.set('view engine', 'pug');
			app.set('view cache', false);

			// populate helpers
			Object.keys(locals).forEach(k => app.locals[k] = locals[k]);

			// allows absolute path in 'extends' for jade
			app.locals.basedir = app.get('views');

			// indented html output
			if (options.pretty) app.locals.pretty = '\t';

			app.get(/^\/(.*)$/, (req, res) => {
				let reqPath = req.params[0];
				if (reqPath === '') reqPath = 'index';

				helpers.lookupData(reqPath, config.dataPath, data => {
					if (config.livereloadPort)
						data.__livereload ='<script src="//' +
							req.hostname + ':' + config.livereloadPort + '/livereload.js"></script>';
					else data.__livereload = false;
					data.req = req;
					try {
						res.render(reqPath, data, (err, output) => {
							if (err) {
								res.status(500).end(err.toString());
								console.error('View error in: ' + reqPath);
								console.error(err);
							}
							else res.end(output);
						});
					}
					catch (e) {
						res.status(404).end('Not found');
					}
				});
			});
		}

		app.listen(config.appPort);
	}

	// LIVERELOAD SERVER

	if (config.livereloadPort) livereload(config.livereloadPort, home + '/' + config.destPath, config.livereloadServerParams);

	// WATCH SOURCES

	[{
		files: config.js,
		command: helpers.resolveBin('watchify') + ' ' + config.sourcePath + '/js/{input} ' +
			helpers.browserifyArgs.join(' ') +
			browserifyArgs.join(' ') +
			' -d -o ' + config.destPath + '/{output}.js'
	}, {
		files: config.styles,
		command: helpers.resolveBin('stylus') + ' ' + config.sourcePath + '/styles/{input} ' +
			helpers.stylusArgs.join(' ') +
			stylusArgs.join(' ') +
			' -m --sourcemap-root ' + config.sourcePath + ' -w -o ' + config.destPath + '/{output}.css'
	}].forEach(watch => {
		const command = watch.command;
		watch.files.forEach(file => {
			const watcher = exec(command
				.replace('{input}', file)
				.replace('{output}', file.split('.').slice(0, -1)));

			watcher.stdout.pipe(process.stdout);
			watcher.stderr.pipe(process.stderr);
		});
	});
};