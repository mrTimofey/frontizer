/**
 * Livereload server
 */

'use strict'
var livereload = require('livereload');

module.exports = function(port, folder) {
	if (port) {
		return livereload.createServer({
			port,
			interval: 100
		}).watch(folder);
	}
	else {
		console.log('Livereload disabled');
	}
}