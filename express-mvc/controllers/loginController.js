	var gu = require("guthrie"),
		user = require(__appRoot + "/lib/user").user;

	var loginController = gu.controller.create();
	loginController.actions = {

		filter: [function(req, res, next) {

		}],
		index: {
			GET: function(req, res) {
				var cookie = req.cookies["remeber"] || {},
					params = {
						email: cookie.email
					};

				res.view(params);
			}
		},
		register: {
			GET: function(req, res) {
				var success = req.query.success;
				if (success == "1") {
					console.log('创建成功');
				}
				res.view();
			}
		},
		save: {
			POST: function(req, res) {
				var params = {
					email: req.body.email,
					password: req.body.password
				};

				user.create(params, function(err, doc) {
					if (err) return res.send(err);
					console.log(params);
					res.redirect("register?success=1");
				});
			}
		},
		signin: {
			POST: function(req, res) {
				var params = {
						email: req.body.email,
						password: req.body.password
					},
					remeber = req.body["remeber"];
				user.verify(params, function(err, doc) {
					if (err) return console.log(err);
					if (doc) {
						if (remeber) {
							res.cookie("remeber", params, {
								maxAge: 60 * 60 * 60 * 10
							});
						} else {
							res.clearCookie("remeber");
						}

						res.cookie("account", params, {
							maxAge: 60 * 60 * 60 * 10
						});
						res.redirect("/main/index");
					} else {
						res.send("帐号名或密码错误!");
					}
				});
			}
		}
	};


	module.exports = loginController;