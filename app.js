/**
 * Application server
 */

'use strict'
var express = require('express'),
	favicon = require('serve-favicon'),
	config = require('./config.json'),
	locals = require('./lib/locals'),
	helpers = require('./lib/helpers'),
	livereload = require('./lib/livereload'),
	exec = require('child_process').exec;

locals.init('app');

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

app.get(/^\/(.*)$/, (req, res) => {
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

// LIVERELOAD SERVER

if (config.livereloadPort) livereload(config.livereloadPort, __dirname + '/assets/compiled');

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