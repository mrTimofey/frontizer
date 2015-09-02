/**
 * Livereload server
 */

var livereload = require('livereload'),
	config = require('./config.json');

if (config.livereloadPort) {
	livereload.createServer({
		port: config.livereloadPort,
		interval: 100
	}).watch(__dirname + '/assets/compiled');
}
else {
	console.log('Livereload disabled');
}