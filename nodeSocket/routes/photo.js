var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
var fs = require('fs');
var async = require('async');
var cheerio = require('cheerio');


function start(fn) {


	//煎蛋网
	// request("http://jandan.net/ooxx", function(err, res, body) {
	// 	if (!err && res.statusCode == 200) {
	// 		acquireData(body, fn);
	// 	}
	// });
	// http://jandan.net/pic/page-7500#comments
	var list = [];
	for (var i = 7500; i <= 7501; i++) { //8905
		var url = "http://jandan.net/pic/page-" + i + "#comments";
		(function(url) {
			list.push(function(cb) {
				console.log(url)
				request(url, function(err, res, body) {
					if (!err && res.statusCode == 200) {
						acquireData(body, cb);
					}
				});
			});
		})(url);
	}
	async.series(list, function(err) {
		if (err) return console.log(err);
		fn();
	});
}

function acquireData(body, fn) {
	var $ = cheerio.load(body),
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
		var filename = getName(val);
		series.push(function(callback) {
			downloadImg(val, 'origin/' + filename, function() {
				console.log(filename + '  done');
				callback();
			});
		});
	});

	small.forEach(function(val) {
		var filename = getName(val);
		series.push(function(callback) {
			downloadImg(val, 'small/' + filename, function() {
				console.log(filename + '  done');
				callback();
			});
		});
	});
	async.series(series, function(err) {
		if (err) console.log("async.series:" + err);
		fn();
	});
}

function downloadImg(uri, filename, fn) {
	request.head(uri, function(err, res, body) {
		// console.log('content-type:', res.headers['content-type']); //这里返回图片的类型
		// console.log('content-length:', res.headers['content-length']); //图片大小
		if (err) {
			console.log('err:' + err);
			return false;
		}
		request(uri).pipe(fs.createWriteStream('./resource/' + filename)).on('close', fn);
	});

}

function getName(address) {
	var filename = path.basename(address);
	return filename;
}

/* GET home page. */
router.get('/photo', function(req, res, next) {
	res.render('photo', {
		title: 'Express'
	});
});

router.post('/photoStart', function(req, res) {

	var urls = req.body.urls;

	// request("10.0.0.164:8010", function(err, res, body) {
	// 	if (!err && res.statusCode == 200) {
	// 		console.log("saysaysay2000")
	// 		res.json({
	// 			"Success": urls
	// 		});
	// 	}
	// });


	// start(function() {
	// 	console.log('i am come in');
	// 	res.json({
	// 		"Success": urls
	// 	});
	// });
});

module.exports = router;