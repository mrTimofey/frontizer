/**
 * Livereload server
 */

'use strict';
const livereload = require('livereload');

module.exports = function(port, folder, params = {}) {
	if (port) {
		params.port = port;
		return livereload.createServer(params).watch(folder);
	}
	else {
		console.log('Livereload disabled');
	}
};