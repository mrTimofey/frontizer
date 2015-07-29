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
}
catch (e) {}

if (config.livereloadPort) {
	livereload.createServer({
		port: config.livereloadPort,
		exts: ['css', 'js'],
		interval: 100
	}).watch(__dirname + '/public');
}
else {
	console.log('Livereload disabled');
}