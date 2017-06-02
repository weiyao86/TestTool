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



//生成菜单并替换webtest中的menu.html文件
router.get('/index/:id', function(req, res, next) {
    var u = user['user' + req.params.id],
        ignore = ['node_modules', '.'];


    var fs = require('fs'),
        path = require('path'),
        url = "http://localhost/Work-git/WebTest/menu.html", //D:\MySpace\webDemo
        localUrl = "D:/Work-git/WebTest/menu.html", //待更改菜单页
        folder = "D:/Work-git/WebTest"; //D:/MySpace/webDemo//D:/Work-git/WebTest--D:/Work-git/WebTest

    fs.readdir(folder, function(err, files) {
        if (err) console.log('读取文件目录失败：' + err);
        var menus = [],
            objC = 0,
            recursive = function(subfs, folderPath, superObj) {

                subfs.forEach(function(val) {
                    var b = false;
                    ignore.forEach(function(iv) {
                        if (val.indexOf(iv) == 0) {
                            b = true;
                            return false;
                        }
                    });

                    if (b) return false;

                    var fp = folderPath + '/' + val;

                    try {
                        var stat = fs.statSync(fp);

                        if (stat.isFile()) {
                            if (path.extname(val) == '.html') {

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
                                    start: true,
                                    children: null,
                                    list: []
                                };
                                menus.push(superObj);
                            }

                            superObj['children'] = [];

                            subfiles.forEach(function(val) {
                                var single = {
                                    title: fp.replace(folder, ''),
                                    val: val,
                                    htmls: [],
                                    guid: objC++,
                                    children: null
                                };
                                if (val.indexOf(".") > -1 && val.indexOf(".html") == -1) {
                                    return false;
                                }
                                recursive([val], fp, single);
                                superObj['children'].push(single);
                            });

                            if (superObj.start) {
                                superObj = null;
                            }
                        }
                    } catch (e) {
                        console.log(e + '---exception');
                    }

                });
            };

        recursive(files, folder);


        //console.log('---menus---');

        //fs.writeFileSync("D:/Work-git/WebTest/menus.txt", menus);

        request(url, {
            timeout: 30 * 1000
        }, function(err, rqres, body) {
            if (err && err.code == "ETIMEDOUT") {
                console.log('你报错了ETIMEDOUT...' + err);
            } else if (!err && rqres.statusCode == 200) {
                var $ = cheerio.load(body, {
                        decodeEntities: false //可以关闭这个转换实体编码的功能 (不然中文乱码)
                    }),
                    $menu = $("#menu"),
                    list = [];


                menus.forEach(function(val) {
                    if (typeof val !== "object") {
                        list.push('<li><a href="' + val + '">' + val + '</a></li>');
                    }
                });

                menus.forEach(function(val) {
                    if (typeof val === "object") {
                        var recursiveObj = function(subObj) {
                            var htmls = null,
                                children = subObj.children,
                                title = children[0] && children[0].title,
                                wtemp = [];

                            if (!title) return;

                            wtemp.push('<dl><dt>' + title + '</dt>');

                            var curfun = function(children) {
                                if (!children.length) return;
                                children.forEach(function(cldval) {

                                    while (cldval) {
                                        title = cldval.title || '';
                                        htmls = cldval.htmls;
                                        if (htmls && htmls.length) {
                                            // wtemp.push('<dt>' + (title || '无标题') + '</dt>');
                                            htmls.forEach(function(f) {
                                                if (path.extname(f) == ".html") {
                                                    var str = "<dd><a href='./" + title + "/" + f + "'>" + cldval.guid + '-' + f + "</a></dd>";
                                                    wtemp.push(str);
                                                }
                                            });
                                        }
                                        if (cldval['leaf']) {
                                            wtemp.push('</dl></dd>');
                                        }

                                        cldval = cldval.children;
                                        if (cldval) {
                                            wtemp.push('<dd><dl>');
                                            cldval['leaf'] = true;
                                            curfun(cldval);
                                        }
                                    }
                                });
                            };
                            curfun(children);

                            wtemp.push('</dl>');

                            list.push('<li>' + wtemp.join('') + '</li>');

                        };

                        recursiveObj(val);

                    }
                });


                var l = list.join('');

                for (var s = 0; s < 50; s++) {
                    l = l.replace(/\s*<dd>\s*<\/dd>\s*|\s*<dd>\s*<dl>\s*<\/dl>\s*<\/dd>\s*/igm, '');
                }

                $menu.html(l);

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