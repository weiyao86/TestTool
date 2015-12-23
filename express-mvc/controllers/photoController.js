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
			var response = {};

			uploadF(req, res, function(err) {
				if (err) commonfun.handlerError(err, res);

				var des_file = __appRoot + '/tempFile/' + req.files[0].originalname;
				fs.readFile(req.files[0].path, function(err0, data) {
					if (err0) commonfun.handlerError(err0, res);
					fs.writeFile(des_file, data, function(err1) {
						if (err1) commonfun.handlerError(err1, res);
						else {
							response = {
								msg: "File uploaded successfully",
								filename: req.files[0].originalname
							}
						}
						//IE下返回值 会被当作文件来下载
						res.set('Content-Type', 'text/html;charset=utf-8');
						res.json(response);
					});
				});
			});
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
					var src = folderPath + "/" + content.filename,
						writeSrc = photoFolder + "/" + content.filename;

					fs.readFile(src, function(err, data) {
						if (err) return console.log("读取--" + src + "--文件错误！error:" + err);

						fs.writeFile(writeSrc, data, function(err1) {
							if (err1) return console.log("写入--" + writeSrc + "--文件错误！error:" + err1);
							commonfun.recursiveDelFile(folderPath);
						});
					});
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
			commonfun.update(req, res, photo, condiction, content);
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