'use strict';
try {
	const vueify = require('vueify');
	const path = require('path');
	const fs = require('fs');

	const localOptionsPath = path.resolve(process.cwd(), 'vue.config.js');
	var localOptions = false;

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