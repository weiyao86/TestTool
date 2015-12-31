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

			req.session["photo"] = 0;

			commonfun.queryAll(res, photo, condition, filters);
		}
	},

	upload: {
		POST: function(req, res) {
			commonfun.uploadFormidable(req, res);
			//commonfun.upload(req, res);
		}
	},

	getFileProgess: {
		POST: function(req, res) {
			commonfun.getFileProgess(req, res);
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
				uid = accout.email, //pause replace uid
				rootDirpath = __appRoot + "/resource/data",
				len = 0,
				hasfocus = false,
				files = [],
				focusFiles = [];

			fs.readdir(rootDirpath, function(err, file) {
				var rst = [];
				for (var i = 0; i < file.length; i++) {
					var curPath = rootDirpath + '/' + file[i];
					if (fs.statSync(curPath).isDirectory()) {
						var fileArr = fs.readdirSync(curPath);
						if (file[i] === "photo") {
							hasfocus = false;
						} else if (file[i] === "focus") {
							hasfocus = true;
						}
						len += fileArr.length;
						rst = rst.concat(callback(fileArr, hasfocus));
					}
				}
				photo.remove({}, function(err) {
					photo.create(rst, function(err) {
						if (err) return commonfun.handlerError(err, res);
						res.send("<p>" + len + "条数据插入成功<p>");
						res.end();
					});
				});

			});
			var callback = function(fileArr, hasfocus) {
				var arr = [];

				for (var i = 0; i < fileArr.length; i++) {
					arr.push({
						uid: uid,
						filename: fileArr[i],
						note: '我是第' + i + '张图的描述',
						isFocusPhoto: hasfocus,
						sort:i,
						createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
						createBy: email,
						modifyDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
						modifyBy: ''
					});
				}
				return arr;
			}
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