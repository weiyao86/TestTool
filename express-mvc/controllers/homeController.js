'use strict';

var gu = require('guthrie'),
	base = require('./baseController');
var homeController = gu.controller.inherit(base);

homeController.actions = {

	// PATH: /
	index: {
		GET: function(req, res) {
			console.log("into home");
			res.render("home/index");
		}
	}
};

module.exports = homeController;