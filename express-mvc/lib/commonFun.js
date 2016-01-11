var fs = require("fs"),
	moment = require("moment"),
	multer = require('multer'), //上传文件中间件
	formidable = require('formidable'), //上传文件插件 可支持做进度条
	tmepFoler = __appRoot + '/tempFile/',
	operatorImg = require(__appRoot + "/lib/operatorImg"), //操作图像
	upprogress = {
		size: 0
	},
	temp,
	uploadF = multer({
		dest: tmepFoler
	}).array("example");

exports.commonfun = {
	randomWord: function() {
		var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', '-', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		arr = arr.concat((new Date()).getTime().toString().split(''));
		arr.sort(function() {
			return Math.random() > 0.5;
		});
		return arr.join('');
	},
	handlerError: function(err, res) {
		return res.json({
			IsSuccess: false,
			msg: err
		});
	},
	queryAll: function(res, model, condition, filters) {
		var limit = (filters && filters.limit) || 0,
			idx = (filters && filters.pageIndex) || 1,
			hasRecords = true;

		model.count(condition || {}, function(err, count) {
			if (err) return handerError(err);

			limit === 0 && (limit = count);

			//计算下一次查询是否还有数据
			if (count <= limit * idx) {
				hasRecords = false;
			}

			var query = model.find(condition || {}, '-__someElse', {
				'sort': {
					"sort": 1,
					"_id": -1
				}
			});
			query.skip(limit * (idx - 1)).limit(limit).exec(function(err, docs) {
				if (err) return commonfun.handlerError(err, res);
				docs = docs.map(function(tag) {
					var rst = tag.toJSON(),
						paths = tag.schema.paths;

					//嵌套过深则此处应该递归处理
					for (var key in paths) {
						if (paths[key].instance === "Date") {
							rst[key] = moment(tag[key]).format("YYYY-MM-DD HH:mm:ss");
						}
					}
					return rst;
				});

				return res.json({
					IsSuccess: true,
					data: docs,
					total: count,
					hasRecords: hasRecords
				});
			});

		});
	},

	insert: function(req, res, model, condiction, content, callback) {
		model.count(condiction, function(err, count) {
			if (err) return commonfun.handlerError(err, res);
			if (count) {
				res.json({
					IsSuccess: true,
					data: [],
					msg: "此条记录已存在"
				});
			} else {
				model.create(content, function(err, doc) {
					if (err) return commonfun.handlerError(err, res);
					if (callback && typeof callback === "function") {
						callback.call(this, req, res, doc);
					}
					res.json({
						IsSuccess: true,
						data: [],
						msg: ''
					});
				});
			}
		});
	},

	update: function(req, res, model, condiction, content, callback) {

		model.findOneAndUpdate(condiction, {
			$set: content
		}, function(err, doc) {
			if (err) return res.json({
				IsSuccess: false,
				msg: err
			});
			if (callback && typeof callback === "function") {
				callback.call(this, req, res, doc);
			}
			res.json({
				IsSuccess: true,
				data: "更新成功"
			});
		});
	},

	destory: function(req, res, model, condiction) {

		model.remove(condiction, function(err) {
			if (err) return res.json({
				IsSuccess: false,
				msg: err
			});
			res.json({
				IsSuccess: true,
				data: "删除成功"
			});
		});
	},

	getFileProgess: function(req, res) {
		var self = this,
			size = upprogress.size,
			temp = 100;

		if ("size" in upprogress) {
			temp = size;
			if (size == 100) {
				delete upprogress.size;
			}
		}
		res.json({
			IsSuccess: true,
			progress: temp
		});
	},

	uploadFormidable: function(req, res) {
		var self = this,
			response = [];

		upprogress.size = 0;
		//创建表单上传
		var form = new formidable.IncomingForm();
		form.encoding = 'utf-8';
		form.uploadDir = tmepFoler;
		form.keepExtensions = true;
		form.maxFiledsSize = 10 * 1024 * 1024 * 1024;

		form.on("field", function(name, val) {});

		form.on("error", function(err) {
			console.log("file upload error" + err);
		});

		form.on("aborted", function() {
			console.log("file upload aborted");
		});


		form.on("progress", function(bytesRecieved, bytesExpected) {
			upprogress.size = Math.ceil((bytesRecieved / bytesExpected) * 100);
		});

		form.on("end", function(bytesRecieved, bytesExpected) {});

		form.parse(req, function(err, fields, files) {
			if (err) self.handlerError(err, res);
			else {
				var file;
				for (var key in files) {
					file = files[key];
					var ext = file.name.match(/(\.\w+)$/)[1],
						imgguid = self.randomWord() + ext;
					response.push({
						msg: "File uploaded successfully",
						filename: file.name,
						imgguid: imgguid
					});
					fs.renameSync(file.path, tmepFoler + imgguid);
				}
			}

			res.set('Content-Type', 'text/html;charset=utf-8');
			res.json(response);
		});
	},

	upload: function(req, res) {
		var self = this,
			response = [];

		uploadF(req, res, function(err) {
			if (err) self.handlerError(err, res);
			var des_file = tmepFoler + req.files[0].originalname;
			fs.readFile(req.files[0].path, function(err0, data) {
				if (err0) self.handlerError(err0, res);
				fs.writeFile(des_file, data, function(err1) {
					if (err1) self.handlerError(err1, res);
					else {
						var filename = req.files[0].originalname,
							ext = filename.match(/(\.\w+)$/)[1],
							imgguid = self.randomWord() + ext;
						response.push({
							msg: "File uploaded successfully",
							filename: filename,
							imgguid: imgguid
						});
					}
					//IE下返回值 会被当作文件来下载
					res.set('Content-Type', 'text/html;charset=utf-8');
					res.json(response);
				});
			});
		});
	},

	writeFileAndRm: function(filename, isFocus, imgguid) {
		var self = this,
			folderPath = __appRoot + '/tempFile',
			photoFolder = __appRoot + "/resource/data/photo",
			focusFolder = __appRoot + "/resource/data/focus",
			originPath = __appRoot + "/resource/data/photoOrigin/" + filename,
			watermarkImg = __appRoot + "/resource/data/waterImg/water.png",
			ext = filename.match(/\.(\w+)$/)[1] || '',
			folder = photoFolder,
			isNew = true;

		if (isFocus) {
			folder = focusFolder;
		}

		var src = folderPath + "/" + filename,
			photoFile = photoFolder + "/" + imgguid,
			focusFile = focusFolder + "/" + imgguid,
			dest = folder + "/" + imgguid;

		//从临时文件夹移动到目标文件夹
		if (fs.existsSync(src)) {
			//add
			src = src;
		} else {
			//update
			if (fs.existsSync(photoFile)) {
				src = photoFile;
			} else if (fs.existsSync(focusFile)) {
				src = focusFile;
			} else {
				return console.log("------------Image is not found!--------------");
			}
			isNew = false;
		}
		fs.renameSync(src, dest);
		if (!isNew) return;

		//将原图保存到、photoOrigin目录下
		var writer = fs.createWriteStream(originPath),
			reader = fs.createReadStream(dest);

		writer.on('finish', function() {
			console.log('原图保存完成---' + originPath);
			//添加水印在右下方
			operatorImg.addWaterMark(originPath, watermarkImg, originPath, 85, "SouthEast", function() {
				console.log('原图水印完成加载---' + originPath);
			});

			//缩略图
			operatorImg.resizeImgWithFullArgs(dest, dest, 100, undefined, 500, ext, function() {
				console.log('目标文件压缩完成---' + dest);
				operatorImg.addWaterMark(dest, watermarkImg, dest, 85, "SouthEast", function() {
					console.log('压缩图水印完成加载---' + dest);
				});
			});

		});
		reader.pipe(writer);


		// fs.readFile(src, function(err, data) {
		// 	if (err) return console.log("读取--" + src + "--文件错误！error:" + err);

		// 	fs.writeFile(dest, data, function(err1) {
		// 		if (err1) return console.log("写入--" + dest + "--文件错误！error:" + err1);
		// 		self.recursiveDelFile(folderPath);//删除临时目录,并发时会有问题
		// 	});
		// });
	},

	recursiveDelFile: function(folderPath) {
		var recursiveDelFile = function(folderPath) {
			if (fs.existsSync(folderPath)) {
				fs.readdirSync(folderPath).forEach(function(file) {
					var curPath = folderPath + '/' + file;
					if (fs.statSync(curPath).isDirectory()) {
						//recursive
						recursiveDelFile(curPath);
					} else {
						fs.unlinkSync(curPath);
					}
				});
			}
		}
		recursiveDelFile(folderPath);
	},

	watchFile: function(filepath) {
		console.log('start Watch');

		fs.watch(__appRoot + filepath, function(event, filename) {
			console.log('event is: ' + event);
			if (filename) {
				console.log('filename provided: ' + filename);
			} else {
				console.log('filename not provided');
			}
		});
	},
	//解决各浏览器文件名中文乱码问题,自定义文件名
	garbled: function(res, req, filename) {
		var userAgent = (req.headers['user-agent'] || '').toLowerCase();
		res.set('Content-Type', 'application/force-download;charset=utf-8');

		if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
			res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
		} else if (userAgent.indexOf('firefox') >= 0) {
			res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename) + '"');
		} else {
			res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
		}
	}

};