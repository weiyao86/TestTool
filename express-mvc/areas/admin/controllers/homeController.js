'use strict';

var gu = require('guthrie');
var adminBaseController = require('./adminBaseController.js')

var homeController = gu.controller.create(); //.inherit(adminBaseController);

homeController.actions = {

	// PATH: /admin
	index: {
		filters: [
			function(req, res, next) {
				this.user = "this.user";
				next();
			}
		],
		GET: function(req, res, next) {
			console.log("admin:" + this.user)
			res.render("home/index");
		}
	}
};

module.exports = homeController;