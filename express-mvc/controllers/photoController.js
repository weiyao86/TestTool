var gu = require("guthrie"),
	fs = require("fs"),
	moment = require("moment"),
	nodeExcel = require('excel-export'),
	commonfun = require(__appRoot + "/lib/commonfun").commonfun,
	filters = require(__appRoot + '/lib/filters'),
	photo = require(__appRoot + "/lib/photo").photo,
	baseController = require("./mybaseController"),
	photoController = gu.controller.inherit(baseController);

var multer = require('multer');
var uploadF = multer({
	dest: __appRoot + '/tempFile'
}).array("example");

photoController.actions = {
	index: {
		GET: function(req, res) {
			res.view();
		}
	},

	read: {
		filters: [filters.photofilter],
		POST: function(req, res) {
			var condition = this.condition,
				filters = this.filters;

			commonfun.queryAll(res, photo, condition, filters);
		}
	},

	// upload: {
	// 	POST: function(req, res) {
	// 		var response = {},
	// 			folderPath = __appRoot + '/tempFile';

	// 		uploadF(req, res, function(err) {
	// 			if (err) commonfun.handlerError(err, res);
	// 			var des_file = __appRoot + '/data/photo/' + req.files[0].originalname;
	// 			fs.readFile(req.files[0].path, function(err0, data) {
	// 				if (err0) commonfun.handlerError(err0, res);
	// 				fs.writeFile(des_file, data, function(err1) {
	// 					if (err1) commonfun.handlerError(err1, res);
	// 					else {
	// 						response = {
	// 							msg: "File uploaded successfully",
	// 							filename: req.files[0].originalname
	// 						}
	// 					}

	// 					//remove cache file
	// 					recursiveDelFile(folderPath);

	// 					res.json(response);
	// 				});
	// 			});
	// 		});
	// 	}
	// },

	insertTempData: {
		GET: function(req, res) {
			var accout = req.cookies["account"],
				email = accout.email,
				uid = accout.email; //pause replace uid

			var arr = [],
				len = 1500;
			for (var i = len; i > 0; i--) {
				arr.push({
					uid: uid,
					filename: i + '.jpg',
					note: '我是第' + i + '张图的描述',
					createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
					creteBy: email,
					modifyDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
					modifyBy: ''
				});
			}
			photo.remove({}, function(err) {
				photo.create(arr, function(err) {
					if (err) return commonfun.handlerError(err, res);
					res.send("<p>" + len + "条数据插入成功<p>");
					res.end();
				});
			});
		}
	},

	// insert: {
	// 	POST: function(req, res) {
	// 		var model = req.body,
	// 			content = {
	// 				email: model.email,
	// 				password: model.password
	// 			};
	// 		commonfun.insert(req, res, user, {
	// 			email: model.email
	// 		}, content);
	// 	}
	// },

	// update: {
	// 	POST: function(req, res) {
	// 		var model = req.body,
	// 			id = model._id,
	// 			condiction;
	// 		delete model["_id"];
	// 		condiction = {
	// 			"_id": id
	// 		};

	// 		commonfun.update(req, res, user, condiction, model);
	// 	}
	// },

	destory: {
		POST: function(req, res) {
			var model = req.body,
				condiction = {
					"_id": model._id
				};

			commonfun.destory(req, res, photo, condiction);
		}
	}
};

module.exports = photoController;