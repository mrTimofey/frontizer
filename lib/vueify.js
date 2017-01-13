'use strict';
try {
	const vueify = require('vueify'),
		path = require('path'),
		fs = require('fs');

	const localOptionsPath = path.resolve(process.cwd(), 'vue.config.js');
	let localOptions = false;

	if (fs.existsSync(localOptionsPath)) localOptions = require(localOptionsPath);

	module.exports = function(file, options) {
		if (localOptions) options = Object.assign({}, localOptions, options);
		return vueify(file, options);
	}
}
catch (e) {
	const through = require('through');
	module.exports = () => through();
	console.log('vueify is disabled');
}