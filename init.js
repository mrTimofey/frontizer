/**
 * New project initialize
 */

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
			name: 'assets/js/main.es6',
		},
		{
			name: 'assets/styles/main.styl',
			content: '@import kouto-swiss\n\nnormalize()'
		},
		{
			name: 'views/layout.jade',
			content: function() {
				return "doctype html\n" +
				"html\n\t" +
					"head\n\t\t" +
						"meta(charset='UTF-8')\n\t\t" +
						"title=title\n\t\t" +
						"link(href=__css rel='stylesheet')\n\t" +
					"body\n\t\t" +
						"main\n\t\t\t" +
						"block main\n\t\t" +
						"script(src=__js)\n\t\t" +
						"if __livereload\n\t\t\t" +
							"script(src=__livereload)";
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
process.argv.slice(2).forEach((v) => {
	v = v.split('=');
	v[0] = v[0].replace('-', '').trim();

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
			v[0] = 'styles';
			config[v[0]] = v[1].split(' ').map(i => i.trim()).filter(i => i.length);
			break;
		case 'js':
			v[0] = 'js';
			config[v[0]] = v[1].split(' ').map(i => i.trim()).filter(i => i.length);
			break;
		default:
			console.error('unrecognized argument: ', v);
			break;
	}
});

fs.writeSync(file, JSON.stringify(config));
console.log('config.json created');

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