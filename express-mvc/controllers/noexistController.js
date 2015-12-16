	var gu = require("guthrie"),
		baseController = require("./mybaseController"),
		noexistController = gu.controller.inherit(baseController);

	noexistController.actions = {
		index: {
			GET: function(req, res) {
				res.view();
			}
		}
	}
	module.exports = noexistController;