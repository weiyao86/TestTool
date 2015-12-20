var fs = require("fs");

exports.commonfun = {
	handlerError: function(err, res) {
		return res.json({
			IsSuccess: false,
			msg: err
		});
	},
	queryAll: function(res,model, condition, filters) {
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
					return tag.toJSON();
				});
				return res.json({
					IsSuccess: true,
					data: docs,
					total: count
				});
			});

		});
	},

	insert: function(req, res,model, condiction, content) {
		model.count(condiction, function(err, count) {
			if (err) return commonfun.handlerError(err, res);
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

	update: function(req, res, model, condiction, content) {

		model.update(condiction, {
			$set: content
		}, function(err) {
			if (err) return res.json({
				IsSuccess: false,
				msg: err
			});
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