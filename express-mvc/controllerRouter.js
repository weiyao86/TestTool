	var gu = require('guthrie'),
		mongoose = require('mongoose'),
		uri = ('mongodb://localhost:27017/node-mvc');

	mongoose.connect(uri);
	var db = mongoose.connection;
	db.on('error', function() {
		console.log('connection error');
	});

	function routerMap(app) {
		// Map routes
		var router = new gu.Router(app, __dirname);

		// example area
		var adminArea = router.createArea('admin');
		adminArea.mapRoute('/admin', {
			controller: 'home',
			action: 'index'
		});

		adminArea.mapRoute('/admin/:controller/:action?/:id?');

		// Catch all route    will map to the 'index' action in the controller
		router.mapRoute('/:controller/:action?/:id?');
	}
	exports.routerMap = routerMap;