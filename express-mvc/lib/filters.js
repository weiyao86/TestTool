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
    		params = {};
    	for (var i in body) {
    		if (body.hasOwnProperty(i)) {
    			var val = body[i];
    			if (val) {
    				if (user.schema.paths[i] && user.schema.paths[i].instance == "String") {
    					params[i] = new RegExp(val, "ig");
    				} else {
    					params[i] = val;
    				}
    			}
    		}
    	}
    	for (var key in params) {
    		if (!user.schema.paths.hasOwnProperty(key)) {
    			delete params[key];
    		}
    	}
    	this.condition = params;

    	next();
    };