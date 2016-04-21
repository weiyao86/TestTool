var request = require('request');
var path = require('path');
var fs = require('fs');
var async = require('async');
var cheerio = require('cheerio');
var child_process = require('child_process');
var clientIo = require("socket.io-client");

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
		if (!fs.existsSync('../resource')) {
			fs.mkdirSync('../resource');
			fs.mkdirSync('../resource/origin');
			fs.mkdirSync('../resource/small');
		}
	},

	start: function(fn) {
		//煎蛋网
		// request("http://jandan.net/ooxx", function(err, res, body) {
		// 	if (!err && res.statusCode == 200) {
		// 		acquireData(body, fn);
		// 	}
		// });
		// http://jandan.net/pic/page-7500#comments 456
		var self = this,
			list = [];
		self.initFolder();

		// for (var i = 1500; i <= 1500; i++) { //1956
		// 	var url = "http://jandan.net/ooxx/page-" + i + "#comments";
		// 	(function(url) {
		// 		list.push(function(cb) {
		// 			console.log(url)
		// 			request(url, function(err, res, body) {
		// 				if (!err && res.statusCode == 200) {
		// 					self.acquireData(body, cb);
		// 				}
		// 			});
		// 		});
		// 	})(url);
		// }

		for (var i = 7500; i <= 7500; i++) { //8905
			var url = "http://jandan.net/pic/page-" + i + "#comments";
			(function(url) {
				list.push(function(cb) {
					console.log(url)
					request(url, function(err, res, body) {
						if (!err && res.statusCode == 200) {
							self.acquireData(body, cb);
						}
					});
				});
			})(url);
		}
		async.series(list, function(err) {
			if (err) return console.log(err);
			fn();
		});
	},

	acquireData: function(body, fn) {
		var self = this,
			$ = cheerio.load(body),
			$wrap = $(".text"),
			origin = [],
			small = [],
			series = [];
		$wrap.each(function(idx, val) {
			var oriurl = $(val).find(".view_img_link").attr("href");
			var smallurl = $(val).find("img").attr("src");
			origin.push(oriurl);
			small.push(smallurl);
		});

		origin.forEach(function(val) {
			var filename = self.getName(val);
			series.push(function(callback) {
				self.downloadImg(val, 'origin/' + filename, function() {
					console.log(filename + '  done');
					if (typeof self.callbacks.writedone === "function") {
						self.callbacks.writedone.call(self, {
							originAddress: val,
							nowAddress: 'origin/' + filename,
							filename: filename
						});
					}
					callback();
				});
			});
		});

		small.forEach(function(val) {
			var filename = self.getName(val);
			series.push(function(callback) {
				self.downloadImg(val, 'small/' + filename, function() {
					console.log(filename + '  done');
					if (typeof self.callbacks.writedone === "function") {
						self.callbacks.writedone.call(self, {
							originAddress: val,
							nowAddress: 'origin/' + filename,
							filename: filename
						});
					}
					callback();
				});
			});
		});
		async.series(series, function(err) {
			if (err) console.log("async.series:" + err);
			fn();
		});
	},

	downloadImg: function(uri, filename, fn) {
		var self = this;
		request.head(uri, function(err, res, body) {
			// console.log('content-type:', res.headers['content-type']); //这里返回图片的类型
			// console.log('content-length:', res.headers['content-length']); //图片大小
			if (err) {
				console.log('err:' + err);
				return false;
			}
			request(uri).pipe(fs.createWriteStream('../resource/' + filename)).on('close', function() {
				fn();
			});
			// if (self.saveFolder.nativeFolder)
			// 	request(uri).pipe(fs.createWriteStream(self.saveFolder.nativeFolder + '/' + filename));
			// if (self.saveFolder.thumbnailsFolder)
			// 	request(uri).pipe(fs.createWriteStream(self.saveFolder.thumbnailsFolder + '/' + filename));
		});
	},

	getName: function(address) {
		var filename = path.basename(address);
		return filename;
	},

	sendClient: function(data) {
		console.log('no no');
	}
};
exports.reptile = reptile;