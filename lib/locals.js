/**
 * Local variables an functions for views
 */

'use strict'
var config = require('../config.json'),
	mode;

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
	return (mode === 'app' ? '/assets/static/' : 'assets/static/') + path;
};

/**
 * Link to view.
 * @param view
 * @returns {string}
 */
exports.linkTo = function(view) {
	if (mode === 'app') {
		if (view === 'home') return '/';
		return '/' + view;
	}
	if (view === '/') view = 'home';
	return view.split('/').join('.') + '.html';
};

exports.init = function(_mode) {
	mode = _mode;

	var path = mode === 'app' ? '/assets/compiled/' : 'assets/compiled/';
	exports.__css = config.styles.map(
		i => '<link href="' + path + i.split('.').slice(0, -1).join('.') + '.css" rel="stylesheet">'
	).join('');
	exports.__js = config.js.map(
		i => '<script src="' + path + i.split('.').slice(0, -1).join('.') + '.js"></script>'
	).join('');

	delete exports.init;
}