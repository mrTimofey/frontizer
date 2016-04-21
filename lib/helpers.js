/**
 * Variables and functions shared by server and build tool
 */

'use strict'
var fs = require('fs');

/**
 * Lookups all data files and merges them into one object.
 * @param {String} path request path
 * @param {Function} after callback to call after data is collected; data passes as parameter
 */
exports.lookupData = function(path, after) {
	path = (path && path != 'home') ? path.split('/') : [];
	if (path[0] == 'home') path.shift();

	let prefix = '';
	// concatenate path segments
	path = path.map((el) => {
		prefix += '/' + el;
		return prefix;
	});

	// always fetch home data
	path.unshift('/home');

	var data = {};

	// function checks data file existance, merges data and
	// calls itself again until path array exhausted
	(function next() {
		if (!path.length) return after(data);
		var file = process.cwd() + '/data' + path.shift();

		fs.exists(file + '.js', exists => {
			if (exists) {
				var fileData = require(file);
				delete require.cache[require.resolve(file)];
				Object.keys(fileData).forEach(k => {
					data[k] = fileData[k];
				});
			}
			next();
		});
	})();
};

exports.stylusArgs = ['-r', '-u kouto-swiss'];
exports.browserifyArgs = [
	'--extensions=.es6', '-t [ ' +
		__dirname + '/../node_modules/babelify --extensions .es6 --presets  ' +
			__dirname + '/../node_modules/babel-preset-es2015 ]',
	'-d', '-v'];