	var gu = require("guthrie"),
		cookieParser = require('cookie-parser'),
		myBaseController = gu.controller.create();

	myBaseController.on("actionExecuting", function(req, res, next) {


		//设置页面中viewbag值
		this.viewbag().auth = {
			email: req.cookies.account.email,
			pwd: req.cookies.account.password
		};
		next();
	});

	module.exports = myBaseController;