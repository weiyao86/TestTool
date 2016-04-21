var gu = require("guthrie"),
	fs = require("fs"),
	moment = require("moment"),
	nodeExcel = require('excel-export'),
	commonfun = require(__appRoot + "/lib/commonfun").commonfun,
	filters = require(__appRoot + '/lib/filters'),
	photo = require(__appRoot + "/lib/photo").photo,
	user = require(__appRoot + "/lib/user").user,
	operatorImg = require(__appRoot + "/lib/operatorImg"),

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
			var writeSrc = __appRoot + "/resource/data/photo/8.jpg",
				waterSrc = __appRoot + "/resource/data/photo/water.jpg",
				watermarkImg = __appRoot + "/resource/data/photo/logo.png";
			//thumb
			// gm(writeSrc).thumb(150, 150, __appRoot + "/resource/data/photo/T33.jpg", function() {
			// 	res.send("done");
			// });


			operatorImg.addWaterMark(writeSrc, watermarkImg, writeSrc, 85, "SouthEast");
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
				tempFolder = __appRoot + '/tempFile',
				rootDirpath = __appRoot + "/resource/importData",
				photoPath = __appRoot + "/resource/data/photo",
				focusPath = __appRoot + "/resource/data/focus",
				len = 0,
				focus = {
					hasfocus: false,
					src: ''
				},
				files = [],
				focusFiles = [];
			!fs.existsSync(tempFolder) && fs.mkdirSync(tempFolder);
			!fs.existsSync(rootDirpath) && fs.mkdirSync(rootDirpath);
			!fs.existsSync(photoPath) && fs.mkdirSync(photoPath);
			!fs.existsSync(focusPath) && fs.mkdirSync(focusPath);


			commonfun.recursiveDelFile(photoPath);
			commonfun.recursiveDelFile(focusPath);

			fs.readdir(rootDirpath, function(err, file) {
				var rst = [];
				for (var i = 0; i < file.length; i++) {
					var curPath = rootDirpath + '/' + file[i];
					if (fs.statSync(curPath).isDirectory()) {
						var fileArr = fs.readdirSync(curPath);
						if (file[i] === "photo") {
							focus.hasfocus = false;
						} else if (file[i] === "focus") {
							focus.hasfocus = true;
						}
						focus.src = curPath;
						len += fileArr.length;
						rst = rst.concat(callback(fileArr, focus));
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
			var callback = function(fileArr, focus) {
				var arr = [];

				for (var i = 0; i < fileArr.length; i++) {
					var filename = fileArr[i],
						ext = filename.match(/(\.\w+)$/)[1],
						imgguid = commonfun.randomWord() + ext;

					//流成功
					(function(filename, imgguid, focus) {
						var writer = fs.createWriteStream(tempFolder + '/' + imgguid);
						var reader = fs.createReadStream(focus.src + '/' + filename);
						var callbackStream = function(imgguid, hasfocus) {
							writer.on('finish', function(err) {
								commonfun.writeFileAndRm(imgguid, hasfocus, imgguid)
							});
						};
						callbackStream(imgguid, focus.hasfocus);
						reader.pipe(writer);

					})(filename, imgguid, focus);

					//同步方法代码更简洁，（异步代码又不简洁了）
					// (function(filename, imgguid, focus) {
					// 	var data = fs.readFileSync(focus.src + '/' + filename);
					// 	fs.writeFileSync(tempFolder + '/' + imgguid, data);
					// 	commonfun.writeFileAndRm(imgguid, focus.hasfocus, imgguid)
					// })(filename, imgguid, focus);



					arr.push({
						uid: uid,
						filename: filename,
						imgguid: imgguid,
						note: '我是第' + (i + 1) + '张图的描述',
						isFocusPhoto: focus.hasfocus,
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
				var filename = model.filename,
					ext = filename.match(/(\.\w+)$/)[1],
					clientName = model.imgguid;
				var condiction = {
						uid: email,
						filename: filename
					},
					content = {
						uid: email,
						filename: filename,
						imgguid: clientName,
						note: model.note,
						sort: model.sort,
						isFocusPhoto: model.isFocusPhoto,
						createBy: doc.nickname,
						createDate: new Date()
					};

				commonfun.insert(req, res, photo, condiction, content, function(req, res, doc) {
					commonfun.writeFileAndRm(clientName, content.isFocusPhoto, clientName);
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
				ext = filename.match(/(\.\w+)$/)[1],
				clientName = model.imgguid,
				condiction = {
					_id: model._id
				},
				content = {
					note: model.note,
					filename: filename,
					imgguid: clientName,
					modifyBy: email,
					isFocusPhoto: model.isFocusPhoto,
					sort: model.sort,
					modifyDate: new Date()
				};

			commonfun.update(req, res, photo, condiction, content, function(req, res, doc) {
				commonfun.writeFileAndRm(clientName, content.isFocusPhoto, clientName);
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