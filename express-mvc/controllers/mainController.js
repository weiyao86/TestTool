	var gu = require("guthrie"),
		user = require(__appRoot + "/lib/user").user,
		baseController = require("./mybaseController"),
		mainController = gu.controller.inherit(baseController);

	mainController.actions = {
		index: {
			GET: function(req, res) {
				res.view();
			}
		},

		queryAll: {
			POST: function(req, res) {
				queryAll(res);
			}
		},
		updateUser: {
			POST: function(req, res) {
				var model = req.body,
					id = model._id;
				delete model["_id"];
				user.update({
					"_id": id
				}, {
					$set: model
				}, function(err) {
					if (err) return res.json({
						IsSuccess: false,
						msg: err
					});
					res.json({
						IsSuccess: true,
						data: "你成功了"
					});
				});


			}
		},

		logout: {
			GET: function(req, res) {
				res.clearCookie("account");
				res.redirect("/login");
			}
		}
	};

	function queryAll(res) {
		user.find({}, '-__v', {
			'sort': {
				"_id": -1
			}
		}, function(err, users) {
			if (err) return console.log(err);
			users = users.map(function(tag) {
				return tag.toJSON();
			});
			res.json({
				IsSuccess: true,
				data: users
			});
		});
	}

	module.exports = mainController;