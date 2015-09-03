/**
 * New project initialize
 */

var fs = require('fs'),
	file,
	// default config
	config = {
		appPort: 3000,
		livereloadPort: 35729
	};

try {
	file = fs.openSync('assets/js/main.js', 'wx');
	console.log('assets/js/main.js created');
}
catch(e) {
	if (e.code === 'EEXIST') console.log('assets/js/main.js exists');
	else throw e;
}

try {
	file = fs.openSync('assets/styles/main.styl', 'wx');
	fs.writeSync(file, "@import kouto-swiss\n\nnormalize()");
	console.log('assets/styles/main.styl created');
}
catch(e) {
	if (e.code === 'EEXIST') console.log('assets/styles/main.styl exists');
	else throw e;
}

file = fs.openSync('config.json', 'w');
process.argv.slice(2).forEach(function (v) {
	v = v.split('=');
	v[0] = v[0].replace('--', '').trim();
	if (v.length < 2 || !config[v[0]]) return console.error('unrecognized argument: ', v);
	config[v[0]] = v[1].trim() * 1;
});
fs.writeSync(file, JSON.stringify(config));
console.log('config.json created');

try {
	file = fs.openSync('views/layout.jade', 'wx');
	fs.writeSync(file,
		"doctype html\nhtml\n\thead\n\t\tmeta(charset='UTF-8')\n\t\ttitle=title\n\t\tlink(href=__css rel='stylesheet')" +
		"\n\tbody\n\t\tmain\n\t\t\tblock main\n\t\tscript(src=__js)" +
			(config.livereloadPort ? "\n\t\tscript(src=__livereload)" : '')
	);
	console.log('views/layout.jade created');
}
catch(e) {
	if (e.code === 'EEXIST') console.log('views/layout.jade exists');
	else throw e;
}

try {
	file = fs.openSync('views/home.jade', 'wx');
	fs.writeSync(file, "extends layout\nblock main\n\th1 Home page");
	console.log('views/home.jade created');
}
catch(e) {
	if (e.code === 'EEXIST') console.log('views/home.jade exists');
	else throw e;
}

try {
	file = fs.openSync('data/home.js', 'wx');
	fs.writeSync(file, "exports.title = 'Hello, world!'");
	console.log('data/home.js created');
}
catch(e) {
	if (e.code === 'EEXIST') console.log('data/home.js exists');
	else throw e;
}