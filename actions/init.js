/**
 * New project initialize
 */

'use strict'
var fs = require('fs'),
	// default config
	config = {
		appPort: 3000,
		livereloadPort: 35729,
		js: ['main.es6'],
		styles: ['main.styl']
	},
	// folders to create on initialization
	folders = [
		'views',
		'data',
		'assets',
		'assets/compiled',
		'assets/fonts',
		'assets/js',
		'assets/static',
		'assets/styles',
	],
	// files to create on initialization
	files = [
		{
			name: 'views/layout.jade',
			content:
				"doctype html\n" +
				"html\n\t" +
					"head\n\t\t" +
						"meta(charset='UTF-8')\n\t\t" +
						"title=title\n\t\t" +
						"!=__css\n\t" +
					"body\n\t\t" +
						"main\n\t\t\t" +
						"block main\n\t\t" +
						"!=__js\n\t\t" +
						"!=__livereload"
		},
		{
			name: 'views/home.jade',
			content: 'extends layout\nblock main\n\th1 Home page'
		},
		{
			name: 'data/home.js',
			content: "exports.title = 'Hello, world!'"
		}
	];

module.exports = function(options, home) {
	home = home || process.cwd();
	if (options) Object.keys(config).forEach(k => { config[k] = options[k] || config[k] });

	['styles', 'js'].forEach(k => {
		let path =  ('assets/' + k),
			createdFiles = [],
			unique = {};

		config[k].forEach(i => {
			let withoutExt = i.split('.').slice(0, -1).join('.');
			if (unique[withoutExt]) {
				console.warn('   ' + k + ' arg "' + i + '" was ignored because it is not unique');
				return;
			}
			unique[withoutExt] = true;

			files.push({ name: path + '/' + i, content: '' });
			createdFiles.push(i);
		});
		config[k] = createdFiles;
	});

	fs.writeSync(fs.openSync(home + '/config.json', 'w'), JSON.stringify(config));
	console.log('config.json created');

	// CREATE FOLDERS

	folders.forEach(folder => {
		try {
			fs.mkdirSync(home + '/' + folder);
			console.log(folder + ' created');
		}
		catch (e) {
			if (e.code === 'EEXIST') console.log(folder + ' already exists');
			else throw e;
		}
	});

	// CREATE FILES

	files.forEach(file => {
		let f;
		try {
			f = fs.openSync(home + '/' + file.name, 'wx');
			if (file.content) fs.writeSync(f, file.content);
			console.log(file.name + ' created');
		}
		catch(e) {
			if (e.code === 'EEXIST') console.log(file.name + ' already exists');
			else throw e;
		}
	});
}