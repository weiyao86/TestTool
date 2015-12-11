	var gu = require("guthrie"),
		commonfun = require(__appRoot + "/lib/commonfun").commonfun,
		filters = require(__appRoot + '/lib/filters'),
		user = require(__appRoot + "/lib/user").user,
		baseController = require("./mybaseController"),
		userController = gu.controller.inherit(baseController);

	userController.actions = {
		index: {
			GET: function(req, res) {
				//add 
				res.view();
			}
		},

		queryAll: {
			filters: [filters.userfilter],
			POST: function(req, res) {

				var condition = this.condition,
					filters = this.filters;
				queryAll(res, condition, filters);
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


	function queryAll(res, condition, filters) {
		var limit = (filters && filters.limit) || 5,
			idx = (filters && filters.pageIndex) || 1;
		user.count(condition || {}, function(err, count) {
			if (err) return handerError(err);

			var query = user.find(condition || {}, '-__v', {
				'sort': {
					"_id": -1
				}
			});
			query.skip(limit * (idx - 1)).limit(limit).exec(function(err, users) {
				if (err) return commonfun.handlerError(err, res);
				users = users.map(function(tag) {
					return tag.toJSON();
				});
				return res.json({
					IsSuccess: true,
					data: users,
					total: count
				});
			});

		});



		// user.find(condition || {}, '-__v', {
		// 	'sort': {
		// 		"_id": -1
		// 	}
		// }, function(err, users) {
		// 	if (err) return commonfun.handlerError(err, res);
		// 	users = users.map(function(tag) {
		// 		return tag.toJSON();
		// 	});
		// 	res.json({
		// 		IsSuccess: true,
		// 		data: users
		// 	});
		// });


	}

	module.exports = userController;