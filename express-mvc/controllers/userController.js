	var gu = require("guthrie"),
		commonfun = require(__appRoot + "/lib/commonfun").commonfun,
		user = require(__appRoot + "/lib/user").user,
		baseController = require("./mybaseController"),
		userController = gu.controller.inherit(baseController);

	userController.actions = {
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

		createUser: {
			POST: function(req, res) {
				var model = req.body,
					params = {
						email: model.email,
						password: model.password
					};

				user.count({
					email: params.email
				}, function(err, count) {
					if (err) return commonfun.handlerError(err, res);
					if (count) {
						res.json({
							IsSuccess: true,
							data: 0
						});
					} else {
						user.create(params, function(err) {
							if (err) return commonfun.handlerError(err, res);
							res.json({
								IsSuccess: true,
								data: 1
							});
						});
					}
				});
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
						data: "更新成功"
					});
				});
			}
		},

		deleteUserByEmail: {
			POST: function(req, res) {
				var model = req.body,
					email = model.email;
				console.log(email);
				user.remove({
					email: email
				}, function(err) {
					if (err) return res.json({
						IsSuccess: false,
						msg: err
					});
					res.json({
						IsSuccess: true,
						data: "删除成功"
					});
				});
			}
		}
	};

	function queryAll(res, condition) {
		user.find(condition || {}, '-__v', {
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

	module.exports = userController;