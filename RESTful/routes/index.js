var express = require('express');
var router = express.Router();
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

		res.render("menu", {
			title: "show menu",
			users: u,
			menu: menus
		});
	});



});


module.exports = router;