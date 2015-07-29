/**
 * Livereload server
 */

var livereload = require('livereload'),
	config = require('./config.default.json');

try {
	customConfig = require('./config.json');
	Object.keys(customConfig).forEach(function(k) {
		config[k] = customConfig[k];
	});
};

if (config.livereloadPort) {
	livereloadServer = livereload.createServer({
		port: config.livereloadPort,
		exts: ['css', 'js'],
		interval: 100
	});

	livereloadServer.watch(__dirname + '/public');
}
else {
	console.log('Livereload disabled');
}