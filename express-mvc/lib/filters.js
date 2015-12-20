    var user = require(__appRoot + "/lib/user").user,
        photo = require(__appRoot + "/lib/photo").photo;

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
        var rst = filterModel(req, res, user);

        this.condition = rst.condition;
        this.filters = rst.filters;
        next();
    };

    exports.photofilter = function(req, res, next) {
        var rst = filterModel(req, res, photo);

        this.condition = rst.condition;
        this.filters = rst.filters;
        next();
    };

    function filterModel(req, res, model) {
        var body = req.body,
            params = {},
            filters = {};

        for (var i in body) {
            if (body.hasOwnProperty(i)) {
                var val = body[i];
                if (val) {
                    if (model.schema.paths[i]) { //筛选数据库查询字段
                        if (model.schema.paths[i].instance == "String") {
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
        return {
            condition: params,
            filters: filters
        };
    }