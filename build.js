/**
 * Building a static site output
 */

'use strict'
var fs = require('fs'),
	path = require('path'),
	jade = require('jade'),
	locals = require('./lib/locals'),
	helpers = require('./lib/helpers');

// alter locals
locals.linkTo = function(view) {
	if (view === '/') view = 'home';
	return view.split('/').join('.') + '.html';
}
var oldStatic = locals.static;
locals.static = function() { return oldStatic.apply(null, arguments).substring(1); }
locals.__css = locals.__css.replace('/assets/', 'assets/');
locals.__js = locals.__js.replace('/assets/', 'assets/');

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