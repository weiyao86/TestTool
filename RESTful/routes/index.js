var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var user = require('../lib/user.json');

/* GET home page. */
router.get('/index', function(req, res, next) {
	res.render('menu', {
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



//生成菜单并替换webtest中的menu.html文件
router.get('/index/:id', function(req, res, next) {
	var u = user['user' + req.params.id];

	var fs = require('fs'),
		path = require('path'),
		url = "http://localhost/Webdemo/menu.html", //D:\MySpace\webDemo
		localUrl = "D:/MySpace/webDemo/menu.html", //待更改菜单页
		folder = "D:/MySpace/webDemo"; //D:/MySpace/webDemo//D:/Work-git/WebTest--D:/Work-git/WebTest

	fs.readdir(folder, function(err, files) {
		if (err) console.log('读取文件目录失败：' + err);
		var menus = [],
			objC = 0,
			recursive = function(subfs, folderPath, superObj) {

				subfs.forEach(function(val) {
					if (val.indexOf(".") == 0) {
						return false;
					}
					var fp = folderPath + '/' + val;
					try {
						var stat = fs.statSync(fp);
						if (stat.isFile()) {
							if (path.extname(val) == '.html') {
								if (val === "browser-bugs.html") {
									console.log(superObj);
									console.log(fp.replace(folder, '') + '===');
									console.log('123');
								}
								if (superObj) {
									[].push.call(superObj['htmls'], val);
								} else {
									menus.push(val);
								}
							}
						} else if (stat.isDirectory()) {
							var subfiles = fs.readdirSync(fp);

							if (!superObj) {
								superObj = {
									title: '',
									htmls: [],
									guid: objC++,
									children: null
								};
								menus.push(superObj);
							}
							superObj['children'] = {
								title: fp.replace(folder, ''),
								htmls: [],
								guid: objC++,
								children: null
							};
							recursive(subfiles, fp, superObj['children']);
							superObj = null;


						}
					} catch (e) {
						console.log(e);
					}
				});
			};

		recursive(files, folder);


		//console.log(menus);

		//fs.writeFileSync("D:/Work-git/WebTest/menus.txt", menus);

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
					if (typeof val === "object") {
						var recursiveObj = function(subObj) {
							var htmls = null,
								title = null,
								children = subObj,
								tempFiles = [],
								wtemp = [];
							wtemp.push('<dl>');
							while (children) {
								title = children.title;
								htmls = children.htmls;

								if (htmls.length) {
									wtemp.push('<dt>' + title + '</dt>');
									htmls.forEach(function(f) {
										if (path.extname(f) == ".html") {
											var str = "<dd><a href='./" + title + "/" + f + "'>" + f + "</a></dd>";
											wtemp.push(str);
										}
									});
								}
								//  else {
								// 	wtemp.push('<dd data-empty="empty"><a href="">我没内容...</a></dd>');
								// }

								if (children['leaf']) {
									wtemp.push('</dl></dd>');
								}

								children = children.children;
								if (children) {
									wtemp.push('<dd><dl>');
									children['leaf'] = true;
								}
							}

							wtemp.push('</dl>');

							if (wtemp.length) {
								//wtemp.splice(-12);
								list.push('<li>' + wtemp.join('') + '</li>');
							}
						};

						recursiveObj(val);
					} else {
						list.push('<li><a href="' + val + '">' + val + '</a></li>');
					}

				});


				$menu.html(list.join(''));
				//$menu.find("[data-empty='empty']").closest("dl").remove();

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