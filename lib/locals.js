'use strict'
var config = require('../config.json');

/**
 * Array of range.
 * @param from
 * @param to
 * @returns {Array}
 */
exports.range = function(from, to) {
	if (!to){
		to = from;
		from = 0;
	}
	to = Math.ceil(to);
	from = Math.ceil(from);
	var a = [];
	while (from++ < to) a.push(from);
	return a;
};

/**
 * Static asset path.
 * @param path
 * @returns {string}
 */
exports.static = function(path) {
	return '/assets/static/' + path;
};

/**
 * Link to view.
 * @param view
 * @returns {string}
 */
exports.linkTo = function(view) {
	if (view === 'home') return '/';
	return '/' + view;
};

exports.__css = config.styles.map(
	i => '<link href="/assets/compiled/' + i.split('.').slice(0, -1).join('.') + '.css" rel="stylesheet">'
).join('');
exports.__js = config.js.map(
	i => '<script src="/assets/compiled/' + i.split('.').slice(0, -1).join('.') + '.js"></script>'
).join('');