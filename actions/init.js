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
	// files to create on initialization
	files = [
		{
			name: 'views/layout.jade',
			content: function() {
				return "doctype html\n" +
				"html\n\t" +
					"head\n\t\t" +
						"meta(charset='UTF-8')\n\t\t" +
						"title=title\n\t\t" +
						"!=__css\n\t" +
					"body\n\t\t" +
						"main\n\t\t\t" +
						"block main\n\t\t" +
						"!=__js\n\t\t" +
						"!=__livereload";
			}
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

// parse config
var file = fs.openSync('config.json', 'w');

function configFileList(k, args, path) {
	path = path || ('assets/' + k);
	args = args.split(' ').map(i => i.trim()).filter(i => i.length);
	let unique = {}, realArgs = [];
	args.forEach(i => {
		let withoutExt = i.split('.').slice(0, -1).join('.');
		if (unique[withoutExt]) {
			console.error(k + ' args must contain only unique file names excluding extensions');
			console.warn('   ' + k + ' arg "' + i + '" was ignored');
			return;
		}
		unique[withoutExt] = true;

		files.push({ name: path + '/' + i, content: '' })
		realArgs.push(i);
	});
	config[k] = realArgs;
}

process.argv.slice(2).forEach((v) => {
	v = v.split('=');
	v[0] = v[0].split('-').join('').trim();

	switch (v[0]) {
		case 'livereloadPort':
		case 'lr':
			v[0] = 'livereloadPort';
			config[v[0]] = v[1].trim() * 1;
			break;
		case 'appPort':
		case 'app':
			v[0] = 'appPort';
			config[v[0]] = v[1].trim() * 1;
			break;
		case 'styles':
			configFileList('styles', v[1]);
			break;
		case 'js':
			configFileList('js', v[1]);
			break;
		default:
			console.error('unrecognized argument: ', v);
			break;
	}
});

fs.writeSync(file, JSON.stringify(config));
console.log('config.json created');
console.log(config);

files.forEach((file) => {
	var f;
	try {
		f = fs.openSync(file.name, 'wx');
		if (file.content) fs.writeSync(f, typeof file.content === 'function' ? file.content() : file.content);
		console.log(file.name + ' created');
	}
	catch(e) {
		if (e.code === 'EEXIST') console.log(file.name + ' already exists');
		else throw e;
	}
});