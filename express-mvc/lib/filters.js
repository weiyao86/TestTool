    var user = require(__appRoot + "/lib/user").user;

    exports.loginRequired = function(req, res, next) {

    	if (!this.authUser) {
    		res.redirect('/account/login');
    	} else {
    		next();
    	}
    };

    exports.adminOnly = function(res, res, next) {
    	if (this.authUser && this.authUser.isAdmin) {
    		next();
    	} else {
    		res.redirect('/');
    	}
    };

    exports.userfilter = function(req, res, next) {
    	var body = req.body,
    		params = {},
    		filters = {};

    	for (var i in body) {
    		if (body.hasOwnProperty(i)) {
    			var val = body[i];
    			if (val) {
    				if (user.schema.paths[i]) { //筛选数据库查询字段
    					if (user.schema.paths[i].instance == "String") {
    						params[i] = new RegExp(val, "ig");
    					} else {
    						params[i] = val;
    					}
    				} else { //与数据库字段无关作其它条件筛选
    					filters[i] = val;
    				}
    			}
    		}
    	}

    	this.condition = params;
    	this.filters = filters;

    	next();
    };