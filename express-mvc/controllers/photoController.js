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

	delay: {
		GET: function(req, res) {
			setTimeout(function() {}, 20 * 10000);
		}
	},

	thumbImg: {
		GET: function(req, res) {
			var writeSrc = __appRoot + "/resource/data/photo/T2.jpg",
				waterSrc = __appRoot + "/resource/data/photo/3.jpg",
				watermarkImg = __appRoot + "/resource/data/photo/nopic.png";
			//thumb
			// gm(writeSrc).thumb(150, 150, __appRoot + "/resource/data/photo/T33.jpg", function() {
			// 	res.send("done");
			// });


			function addWaterMark(srcImg, watermarkImg, destImg, alpha, position) {
				var composite = spawn('gm', ['composite', '-gravity', position, '-dissolve', alpha, watermarkImg, srcImg, destImg]);
				composite.on('exit', function(code) {
					console.log(arguments);

				});
			}
			addWaterMark(writeSrc, watermarkImg, waterSrc, 50, "Center");
			//webimg(writeSrc).markText("我是水印").markPos(5); //.fontSize(50).fontColor("#ff8800").watermark(waterSrc);
			//console.log((webimg({}).captcha()).getStr());


			// gm(writeSrc).size(function(err) {
			// 	if (err) return console.log(err);
			// 	console.log(arguments);
			// 	res.send(arguments)
			// });


			// res.send("done");
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
						note: '我是第' + (i + 1) + '张图的描述',
						isFocusPhoto: hasfocus,
						sort: i + 1,
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
						sort: model.sort,
						isFocusPhoto: model.isFocusPhoto,
						createBy: doc.nickname,
						createDate: new Date()
					};

				commonfun.insert(req, res, photo, condiction, content, function() {
					commonfun.writeFileAndRm(content.filename, content.isFocusPhoto);
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
					isFocusPhoto: model.isFocusPhoto,
					sort: model.sort,
					modifyDate: new Date()
				};
			commonfun.update(req, res, photo, condiction, content, function() {
				commonfun.writeFileAndRm(content.filename, content.isFocusPhoto);
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