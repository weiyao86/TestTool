var gu = require("guthrie"),
	fs = require("fs"),
	moment = require("moment"),
	commonfun = require(__appRoot + "/lib/commonfun").commonfun,
	filters = require(__appRoot + '/lib/filters'),
	photo = require(__appRoot + "/lib/photo").photo,
	baseController = require("./mybaseController"),
	photoDetailController = gu.controller.inherit(baseController);

photoDetailController.actions = {
	index: {
		GET: function(req, res) {
			res.render("photo/detail");
		}
	},

	read: {
		filters: [filters.photofilter],
		POST: function(req, res) {
			var condition = this.condition,
				filters = this.filters;

			commonfun.queryAll(res, photo, condition, filters);
		}
	},

	upload: {
		POST: function(req, res) {}
	},

	destroyAll: {
		GET: function(req, res) {}
	},

	insertTempData: {
		GET: function(req, res) {

		}
	},

	insert: {
		POST: function(req, res) {}
	},

	update: {
		POST: function(req, res) {}
	},

	destroy: {
		POST: function(req, res) {}
	}
};

module.exports = photoDetailController;