var gu = require("guthrie"),
	fs = require("fs"),
	moment = require("moment"),
	nodeExcel = require('excel-export'),
	commonfun = require(__appRoot + "/lib/commonfun").commonfun,
	filters = require(__appRoot + '/lib/filters'),
	photo = require(__appRoot + "/lib/photo").photo,
	user = require(__appRoot + "/lib/user").user,
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

	upload: {
		POST: function(req, res) {
			commonfun.upload(req, res);
		}
	},

	destroyAll: {
		GET: function(req, res) {
			photo.remove({}, function(err) {
				if (err) return commonfun.handlerError(err, res);
				res.send("<p>数据清空完毕<p>");
				res.end();
			});
		}
	},

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

	insert: {
		POST: function(req, res) {
			var folderPath = __appRoot + '/tempFile',
				photoFolder = __appRoot + "/data/photo",
				model = req.body,
				email = req.cookies["account"].email;

			var callback = function(doc) {
				var condiction = {
						uid: email,
						filename: model.filename
					},
					content = {
						uid: email,
						filename: model.filename,
						note: model.note,
						createBy: doc.nickname,
						createDate: new Date()
					};

				commonfun.insert(req, res, photo, condiction, content, function() {
					commonfun.writeFileAndRm(content.filename);
				});
			};

			user.findOne({
				email: email
			}, function(err, doc) {
				if (err) return commonfun.handlerError(err, res);
				callback.call(this, doc);
			});

		}
	},

	update: {
		POST: function(req, res) {
			var model = req.body,
				email = req.cookies["account"].email,
				uid = model.uid,
				filename = model.filename,
				condiction = {
					_id: model._id
				},
				content = {
					note: model.note,
					filename: filename,
					modifyBy: email,
					modifyDate: new Date()
				};
			commonfun.update(req, res, photo, condiction, content, function() {
				commonfun.writeFileAndRm(content.filename);
			});
		}
	},

	destroy: {
		POST: function(req, res) {
			var model = req.body,
				condiction = {
					"_id": model._id
				};

			console.log(model._id)

			commonfun.destory(req, res, photo, condiction);
		}
	}
};

module.exports = photoController;