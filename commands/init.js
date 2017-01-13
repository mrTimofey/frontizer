/**
 * New project initialize
 */

'use strict';
const fs = require('fs');

	// folders to create on initialization
let folders = [],
	// files to create on initialization
	files = [];

module.exports = function(options, home) {
	// default config
	let config = {
		appPort: 3000,
		livereloadPort: 35729,
		js: ['main.js'],
		styles: ['main.styl'],
		viewsPath: 'views',
		sourcePath: 'assets',
		destPath: 'assets/compiled',
		dataPath: 'data',
		apiPath: 'api',
		cors: true
	};

	home = home || process.cwd();
	if (options) Object.keys(config).forEach(k => { config[k] = options[k] || config[k] });
	for (let optional of ['apiRoot']) {
		if (options[optional]) config[optional] = options[optional];
	}

	// sources
	['styles', 'js'].forEach(k => {
		let path =  config.sourcePath + '/' + k,
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

	// config fields containing folders to create
	let configFolders = ['sourcePath', 'destPath'];

	// express app settings
	if (config.appPort) {
		configFolders.push('viewsPath');
		configFolders.push('dataPath');
		folders.push('data');
	}

	// CREATE FOLDERS
	
	configFolders.forEach(k => {
		config[k] = config[k].replace(/^\/|\/$/g, '');
		let cur = '';
		for (let f of config[k].split('/')) {
			cur += f;
			if (folders.indexOf(cur) === -1) folders.push(cur);
			cur += '/';
		}
	});

	folders.push(config.sourcePath + '/styles');
	folders.push(config.sourcePath + '/js');
	folders.push(config.sourcePath + '/fonts');
	folders.push(config.sourcePath + '/static');

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

	if (config.appPort) {
		files.push({
			name: config.viewsPath + '/layout.pug',
			content:
			"doctype html\n" +
			"html\n\t" +
				"head\n\t\t" +
					"meta(charset=\"UTF-8\")\n\t\t" +
					"title=title\n\t\t" +
					"meta(name=\"viewport\" content=\"width=device-width,initial-scale=1,user-scalable=no,maximum-scale=1\")\n\t\t" +
					"!=__css\n\t" +
				"body\n\t\t" +
					"main\n\t\t\t" +
						"block main\n\t\t" +
					"!=__js\n\t\t" +
					"!=__livereload"
		});
		files.push({
			name: config.viewsPath + '/index.pug',
			content: 'extends layout\nblock main\n\th1 Home page'
		});
		files.push({
			name: config.dataPath + '/index.js',
			content: "exports.title = 'Hello, world!'"
		});
	}

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

	fs.writeSync(fs.openSync(home + '/config.json', 'w'), JSON.stringify(config));
	console.log('config.json created');
};