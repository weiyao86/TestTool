	var gu = require("guthrie"),
		baseController = require("./mybaseController"),
		noexistController = gu.controller.inherit(baseController);

	noexistController.actions = {
		index: {
			GET: function(req, res) {
				console.log('404');
				res.view();
			}
		}
	}
	module.exports = noexistController;