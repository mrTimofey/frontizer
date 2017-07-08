/**
 * Building a static site output
 */

'use strict';
const fs = require('fs'),
	path = require('path'),
	pug = require('pug'),
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
		'build/compiled',
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

		const folder = home + '/' + config.viewsPath + (parents.length ? ('/' + parents.join('/')) : '');

		for (let file of fs.readdirSync(folder)) {
			let viewFullPath = folder + '/' + file,
				htmlFile = parents.concat([file.replace('.pug', '.html')]).join('.');

			// recursively scan subfolders
			if (fs.lstatSync(viewFullPath).isDirectory()) {
				scan(parents.concat([file]));
				continue;
			}

			// ignore wrong extensions
			if (path.extname(file) !== '.pug') continue;

			(function(route, htmlFile, viewFullPath) {
				helpers.lookupData(route, config.dataPath, data => {
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
					data.basedir = home + '/' + config.viewsPath;
					data.pretty = options.pretty ? '\t' : false;

					fs.writeFileSync(home + '/build/' + htmlFile, pug.renderFile(viewFullPath, data), { flags: 'w' });

					console.log('build/' + htmlFile + ' created');
				});
			})(parents.join('/') + '/' + file.replace('.pug', ''), htmlFile, viewFullPath);
		}
	})();

	// BUILD ASSETS

	[{
		files: config.js,
		command: helpers.resolveBin('cross-env') + ' NODE_ENV=production ' +
			helpers.resolveBin('browserify')  +' ' + config.sourcePath + '/js/{input} ' +
			helpers.browserifyArgs.join(' ') + ' | ' +
			helpers.resolveBin('uglifyjs') + ' -c > build/compiled/{output}.js'
	}, {
		files: config.styles,
		command: helpers.resolveBin('cross-env') + ' NODE_ENV=production ' +
			helpers.resolveBin('stylus') + ' ' + config.sourcePath + '/styles/{input} ' +
			helpers.stylusArgs.join(' ') + ' -c -o build/compiled/{output}.css'
	}].forEach(build => {
		const command = build.command;
		build.files.forEach(file => {
			const builder = exec(command
				.replace('{input}', file)
				.replace('{output}', file.split('.').slice(0, -1)));

			builder.stdout.pipe(process.stdout);
			builder.stderr.pipe(process.stderr);
		});
	});

	// COPY STATIC FILES

	ncp(home + '/' + config.sourcePath + '/static', home + '/build/assets/static');
	ncp(home + '/' + config.sourcePath + '/fonts', home + '/build/assets/fonts');
};