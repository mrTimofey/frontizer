/**
 * Building a static site output
 */

'use strict'
var fs = require('fs'),
	path = require('path'),
	jade = require('jade'),
	locals = require('../lib/locals'),
	helpers = require('../lib/helpers'),
	exec = require('child_process').exec,
	ncp = require('ncp').ncp;

module.exports = function(_options, home) {
	// default options
	let options = { pretty: false };

	home = home || process.cwd();
	if (_options) Object.keys(options).forEach(k => { options[k] = _options[k] || options[k] });

	let config = require(home + '/config.json');

	locals.init('static', home, config);

	// CREATE FOLDERS

	[
		'build',
		'build/assets',
		'build/assets/compiled',
		'build/assets/static',
		'build/assets/fonts'
	].forEach(folder => {
		try {
			fs.mkdirSync(folder);
		}
		catch (e) {
			if (e.code !== 'EEXIST') throw e;
		}
	});

	// SCAN AND BUILD VIEWS

	(function scan(parents) {
		parents = parents || [];

		var folder = home + '/views' + (parents.length ? ('/' + parents.join('/')) : '');

		for (let file of fs.readdirSync(folder)) {
			let viewFullPath = folder + '/' + file,
				htmlFile = parents.concat([file.replace('.jade', '.html')]).join('.');

			// recursively scan subfolders
			if (fs.lstatSync(viewFullPath).isDirectory()) {
				scan(parents.concat([file]));
				continue;
			}

			// ignore wrong extensions
			if (path.extname(file) !== '.jade') continue;

			(function(route, htmlFile, viewFullPath) {
				helpers.lookupData(route, data => {
					Object.keys(locals).forEach(k => data[k] = locals[k]);

					// emulate express.req
					data.req = {
						baseUrl: htmlFile,
						hostname: 'localhost',
						ip: '127.0.0.1',
						method: 'GET',
						originalUrl: htmlFile,
						params: {},
						path: htmlFile,
						prototcol: 'http',
						xhr: false,
						query: {}
					};
					data.__livereload = '';
					data.basedir = home + '/views';
					data.pretty = options.pretty ? '\t' : false;

					fs.writeFileSync(home + '/build/' + htmlFile, jade.renderFile(viewFullPath, data), { flags: 'w' });

					console.log('build/' + htmlFile + ' created');
				});
			})(parents.join('/') + '/' + file.replace('.jade', ''), htmlFile, viewFullPath);
		}
	})();

	// BUILD ASSETS

	[{
		files: config.js,
		command: __dirname + '/../node_modules/.bin/browserify assets/js/{input} ' + helpers.browserifyArgs.join(' ') + ' -o build/assets/compiled/{output}.js'
	}, {
		files: config.styles,
		command: __dirname + '/../node_modules/.bin/stylus assets/styles/{input} ' + helpers.stylusArgs.join(' ') + ' -o build/assets/compiled/{output}.css'
	}].forEach(build => {
		var command = build.command;
		build.files.forEach(file => {
			var builder = exec(command
				.replace('{input}', file)
				.replace('{output}', file.split('.').slice(0, -1)));

			builder.stdout.pipe(process.stdout);
			builder.stderr.pipe(process.stderr);
		});
	});

	// COPY STATIC FILES

	ncp(home + '/assets/static', home + '/build/assets/static');
	ncp(home + '/assets/fonts', home + '/build/assets/fonts');
};