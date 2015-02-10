var handlebars = require('express3-handlebars');

exports.init = function(app) {
	app.engine('htm', handlebars({ defaultLayout: 'main', extname: '.htm' }));
	app.set('view engine', 'htm');
};