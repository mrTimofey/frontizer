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

exports.__css = '/assets/compiled/main.css';
exports.__js = '/assets/compiled/main.js';