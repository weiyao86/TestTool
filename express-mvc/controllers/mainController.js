	var gu = require("guthrie"),
		baseController = require("./mybaseController"),
		mainController = gu.controller.inherit(baseController);

	mainController.actions = {
		index: {
			GET: function(req, res) {
				res.view();
			}
		},

		logout: {
			GET: function(req, res) {
				res.clearCookie("account");
				res.redirect("/login");
			}
		}
	};

	module.exports = mainController;