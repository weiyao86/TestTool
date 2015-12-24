var fs = require("fs"),
	moment = require("moment"),
	multer = require('multer'),
	tmepFoler = __appRoot + '/tempFile/',
	uploadF = multer({
		dest: tmepFoler
	}).array("example");

exports.commonfun = {
	handlerError: function(err, res) {
		return res.json({
			IsSuccess: false,
			msg: err
		});
	},
	queryAll: function(res, model, condition, filters) {
		var limit = (filters && filters.limit) || 0,
			idx = (filters && filters.pageIndex) || 1;

		model.count(condition || {}, function(err, count) {
			if (err) return handerError(err);

			limit === 0 && (limit = count);

			var query = model.find(condition || {}, '-__someElse', {
				'sort': {
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
					total: count
				});
			});

		});
	},

	insert: function(req, res, model, condiction, content, callback) {
		model.count(condiction, function(err, count) {
			if (err) return commonfun.handlerError(err, res);
			if (callback && typeof callback === "function") {
				callback.call(req, res);
			}
			if (count) {
				res.json({
					IsSuccess: true,
					data: [],
					msg: "此条记录已存在"
				});
			} else {
				model.create(content, function(err) {
					if (err) return commonfun.handlerError(err, res);
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

		model.update(condiction, {
			$set: content
		}, function(err) {
			if (err) return res.json({
				IsSuccess: false,
				msg: err
			});
			if (callback && typeof callback === "function") {
				callback.call(req, res);
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

	upload: function(req, res) {
		var self = this,
			response = {};

		uploadF(req, res, function(err) {
			if (err) self.handlerError(err, res);
			var des_file = tmepFoler + req.files[0].originalname;
			fs.readFile(req.files[0].path, function(err0, data) {
				if (err0) self.handlerError(err0, res);
				fs.writeFile(des_file, data, function(err1) {
					if (err1) self.handlerError(err1, res);
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
	},

	writeFileAndRm: function(filename) {
		var self = this,
			folderPath = __appRoot + '/tempFile',
			photoFolder = __appRoot + "/data/photo";

		var src = folderPath + "/" + filename,
			writeSrc = photoFolder + "/" + filename;

		fs.readFile(src, function(err, data) {
			if (err) return console.log("读取--" + src + "--文件错误！error:" + err);

			fs.writeFile(writeSrc, data, function(err1) {
				if (err1) return console.log("写入--" + writeSrc + "--文件错误！error:" + err1);
				self.recursiveDelFile(folderPath);
			});
		});
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