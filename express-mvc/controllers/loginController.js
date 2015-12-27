	var gu = require("guthrie"),
		user = require(__appRoot + "/lib/user").user,
		maxAge = 1000*60*60*24*5;//过期时间5天

	var loginController = gu.controller.create();
	loginController.actions = {

		filter: [function(req, res, next) {

		}],
		index: {
			GET: function(req, res) {
				var cookie = req.cookies["remeber"] || {},
					params = {
						email: (cookie.email || '').trim()
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
								maxAge: maxAge
							});
						} else {
							res.clearCookie("remeber");
						}

						res.cookie("account", params, {
							maxAge: maxAge
						});
						res.redirect("/main");
					} else {
						res.send("帐号名或密码错误!");
					}
				});
			}
		}
	};


	module.exports = loginController;