/**
 * Building a static site output
 */

'use strict'
var fs = require('fs'),
	path = require('path'),
	jade = require('jade'),
	locals = require('./lib/locals'),
	helpers = require('./lib/helpers'),
	config = require('./config.json'),
	exec = require('child_process').exec,
	ncp = require('ncp').ncp;

locals.init('static');

// SCAN AND BUILD VIEWS

function scan(parents) {
	parents = parents || [];

	var folder = './views' + (parents.length ? ('/' + parents.join('/')) : '');

	for (let file of fs.readdirSync(folder)) {
		var viewFullPath = folder + '/' + file,
			htmlFile = parents.concat([file.replace('.jade', '.html')]).join('.');

		// recursively scan subfolders
		if (fs.lstatSync(viewFullPath).isDirectory()) {
			scan(parents.concat([file]));
			continue;
		}

		// ignore wrong extensions
		if (path.extname(file) !== '.jade') continue;

		(function(route, htmlFile, viewFullPath) {
			helpers.lookupData(route, (data) => {
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
					xhr: false
				};
				data.__livereload = '';
				data.basedir = './views';

				fs.writeFileSync('./build/' + htmlFile, jade.renderFile(viewFullPath, data), { flags: 'w' });

				console.log(viewFullPath + ' => ./build/' + htmlFile);
			});
		})(parents.join('/') + '/' + file.replace('.jade', ''), htmlFile, viewFullPath);
	}
}

scan();

// CREATE FOLDERS

[
	'build/assets',
	'build/assets/compiled',
	'build/assets/static',
	'build/assets/fonts'
].forEach(function(folder) {
	try {
		fs.mkdirSync(folder);
	}
	catch (e) {
		if (e.code !== 'EEXIST') throw e;
	}
});

// BUILD SOURCES

[{
	files: config.js,
	command: 'browserify assets/js/{input} ' + helpers.browserifyArgs.join(' ') + ' -o build/assets/compiled/{output}.js'
}, {
	files: config.styles,
	command: 'stylus assets/styles/{input} ' + helpers.stylusArgs.join(' ') + ' -o build/assets/compiled/{output}.css'
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

// COPY STATIC ASSETS

ncp('assets/static', 'build/assets/static');
ncp('assets/fonts', 'build/assets/fonts');