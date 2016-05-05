var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var user = require('../lib/user.json');

/* GET home page. */
router.get('/index', function(req, res, next) {
	res.render('index', {
		title: 'Express',
		users: user
	});
});

router.post('/addUser', function(req, res, next) {
	var body = '';
	console.log('come in')

	req.on('data', function(data) {
		body += data;
		console.log(body);
	});

	req.on('end', function(data) {
		user['user4'] = {
			"id": 4,
			"name": 'wei',
			"password": "123",
			"profession": "know"
		};
		res.json({
			Message: 'User Added'
		});
	});
});

router.get('/:id', function(req, res, next) {
	var u = user['user' + req.params.id];

	var fs = require('fs'),
		path = require('path'),
		folder = "D:/Work-git/WebTest";
	fs.readdir(folder, function(err, files) {
		if (err) console.log('读取文件目录失败：' + err);
		var menus = [];
		files.forEach(function(val) {
			var stat = fs.statSync(folder + '/' + val);
			if (stat.isFile()) {
				if (path.extname(val) == '.html') {
					menus.push(val);
				}
			}
		});

		var url = "http://localhost/WebTest/menu.html",
			localUrl = "D:/Work-git/WebTest/menu.html";
		request(url, {
			timeout: 30 * 1000
		}, function(err, rqres, body) {
			if (err && err.code == "ETIMEDOUT") {
				console.log('你报错了ETIMEDOUT...' + err);
			} else if (!err && rqres.statusCode == 200) {
				var $ = cheerio.load(body, {
					decodeEntities: false //可以关闭这个转换实体编码的功能 (不然中文乱码)
				});
				var $menu = $("#menu");
				var list = [];

				menus.forEach(function(val) {
					if (val.indexOf('js常用函数') == 0) console.log('<li><a href=' + val + '>' + val + '</a></li>');


					list.push('<li><a href=' + val + '>' + val + '</a></li>');
				});
				$menu.empty().append(list.join(''));

				fs.writeFile(localUrl, $.html(), function(err1) {
					if (err1) console.log("writeFile-error:" + err1);
					console.log("已替换本地文件--" + localUrl);
					res.render("menu", {
						title: "更新webdemo中菜单",
						users: u,
						menu: menus
					});
				});
			}
		});

	});
});


module.exports = router;