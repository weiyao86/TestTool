'use strict';

var gu = require('guthrie');
var db = require(__appRoot + '/lib/db');

var baseController = gu.controller.create();

baseController.on('actionExecuting', function(req, res, next) {

	var self = this;
	console.log("into baseController");
	return next();
	db.getCategories(self.app, function(err, categories) {
		if (err) throw err;
		self.viewbag().categories = categories;

		var authEmailId = req.session.authEmailId;

		if (authEmailId) {
			db.findCutomerByEmail(self.app, authEmailId, function(err, customer) {
				if (err) throw err;

				if (customer) {
					self.authUser = customer;
					self.viewbag().authUser = customer;
				}

				next();
			});
		} else {
			next();
		}
	});
});

module.exports = baseController;