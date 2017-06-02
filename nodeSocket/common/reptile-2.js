var request = require('request');
var path = require('path');
var fs = require('fs');
var async = require('async');
var cheerio = require('cheerio');
var child_process = require('child_process');
var clientIo = require("socket.io-client");
var logger = require('./log4js.js').logforName('reptile-2');

var reptile = {
	callbacks: {
		writedone: null
	},

	outFolder: function(data) {
		var self = this,
			nativeFolder = data.native,
			thumbnailsFolder = data.thumbnails;

		!fs.existsSync(data.native) && (data.native = false);
		!fs.existsSync(data.thumbnails) && (data.thumbnails = false);

		self.saveFolder = {
			nativeFolder: data.native,
			thumbnailsFolder: data.thumbnails
		};
	},

	initFolder: function() {
		var self = this;
		if (!fs.existsSync('./resource')) {
			fs.mkdirSync('./resource');
			fs.mkdirSync('./resource/origin');
			fs.mkdirSync('./resource/small');
		}
	},

	start: function(fn) {
		var self = this,
			list = [];
		self.initFolder();

		function letUrl(url) {
			list.push(function(cb) {
				logger.info('--------------------------------' + url + '--------------------------------');
				request(url, {
					timeout: 60 * 1000
				}, function(err, res, body) {
					if (err && err.code == "ETIMEDOUT") {
						logger.info('你报错了ETIMEDOUT...' + err);
						cb();
					} else if (!err && res.statusCode == 200) {
						self.acquireData(body, cb);
					}
				});
			});
		}

		var url = "http://www.gratisography.com/";
		letUrl(url);

		async.series(list, function(err) {
			if (err) return logger.info(err);
			fn();
		});
	},

	acquireData: function(body, fn) {
		var self = this,
			$ = cheerio.load(body),
			$wrap = $("a[download]"),
			origin = [],
			small = [],
			series = [];

		$wrap.each(function(idx, val) {

			var smallurl = $wrap.attr("href");
			small.push(smallurl);
		});

		small.forEach(function(val) {
			var filename = self.getName(val);
			series.push(function(callback) {

				request(val, {
					timeout: 60 * 1000
				}, function(err2, res2, body) {
					if (!err2 && res2.statusCode == 200) {
						var $w = cheerio.load(body),
							$img = $w(".absolute-center"),
							imgSrc = $img.attr("src");


						self.downloadImg(imgSrc, 'small/' + filename, function() {

							if (typeof self.callbacks.writedone === "function") {
								self.callbacks.writedone.call(self, {
									originAddress: imgSrc,
									nowAddress: 'small/' + filename,
									filename: filename
								});
							}
							callback();
						});


					}
				});


			});
		});

		async.series(series, function(err) {
			if (err) logger.info("async.series:" + err);
			fn();
		});
	},

	downloadImg: function(uri, filename, fn) {
		var self = this;
		if (!uri || !uri.trim().length) {
			logger.info('你报错了...' + uri);
			return fn();
		}

		request.head(uri, function(err, res, body) {
			if (!err && res.statusCode == 200) {
				// logger.info('content-type:', res.headers['content-type']); //这里返回图片的类型
				// logger.info('content-length:', res.headers['content-length']); //图片大小

				request(uri, {
					timeout: 60 * 1000
				}, function(err) {
					if (err && err.code == "ETIMEDOUT") {
						fn();
						logger.info('你报错了ETIMEDOUT...' + err);
						return false;
					}
				}).pipe(fs.createWriteStream('./resource/' + filename)).on("error", function(err) {
					logger.info(err.code + "--request-error:" + err);
					fn();
				}).on('close', function() {
					logger.info(uri + '------done');
					fn();
				});
			} else {
				logger.info('err:' + err + '-----uri---' + uri);
				fn();
			}
		});
	},

	getName: function(address) {
		var filename = path.basename(address);
		filename = filename.replace(/\?.*$/ig, '');
		return filename;
	}
};

//捕获所有的异常
process.on('uncaughtException', function(err) {
	logger.info('logger--uncaughtException:-----' + err);
});
exports.reptile = reptile;