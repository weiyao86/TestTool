var fs = require("fs");
var gulp = require('gulp');
var sass = require('gulp-sass'); //预处理css
var uglify = require('gulp-uglify'); //压缩
var rename = require('gulp-rename'); //重命名
// var minifycss = require('gulp-minify-css');
var cleanCss = require('gulp-clean-css');
var minifyhtml = require('gulp-minify-html');
var concat = require('gulp-concat'); //合并
var postcss = require('gulp-postcss'); //为autoprefixer服务
var autoprefixer = require('autoprefixer'); //为css自动添加前缀
var watch = require('gulp-watch'); //实时监听
var livereload = require('gulp-livereload'); //实时刷新网页需配合chrome插件
var rjs = require('gulp-requirejs'); //针对amd规范压缩 将所有依赖文件合并到一个文件与amd-optimize相似
var amdOptimize = require('amd-optimize'); //针对amd规范压缩，需要concat合并到一个文件
var requirejs = require('requirejs'); //针对require规范压缩
var copy = require('copy-to'); //复制对象功能
var copyFile = require('gulp-copy'); //复制文件功能
var async = require('async'); //async.series 实现队列形式，串联所有回调
var ginsert = require("gulp-insert");
// var jslint = require("gulp-jslint");
var watchCss = gulp.watch('./public/styles/*.css');

var dateFormat = require('dateformat');
var now = new Date();
var dateTime = dateFormat(now, "isoDateTime");
var comments = "/* build date: " + dateTime + " */ \n";

//加载所有package.json中的插件如：gulp-minify-html  ==> $.minifyHtml
//var $=require("gulp-load-plugins");

var util = {
	log: function(text) {
		console.log("| ");
		console.log("| >>" + text);
	}
};
//build sass
gulp.task("sass", function() {
	//.pipe(sass({outputStyle: 'extend'})extend/compressed/compact
	gulp.src('./public/styles/*.scss')
		.pipe(sass({
			outputStyle: 'compact'
		}).on('error', function() {
			console.log('error'); //sass.logError
		}))
		.pipe(postcss([autoprefixer]))
		.pipe(gulp.dest('./public/styles/css/'))
		.pipe(livereload());
});

//压缩js并重命名
gulp.task("uglify", function() {
	return gulp.src('./js/*.js')
		.pipe(uglify())
		.pipe(rename('custom.min.js'))
		.pipe(gulp.dest('./release/js'));
});


//这玩意不搞个strict模式就没法用……。
gulp.task("jslint", function() {
	return gulp.src(["./public/scripts/app/**/*.js"])
		.pipe(jslint({
			node: true,
			evil: true,
			nomen: true,
			global: ['$'],
			predef: [],
			reporter: 'default',
			edition: '2014-07-08',
			errorsOnly: false
				// reporter: function(evt) {
				// 	var msg = ' ' + evt.file;
				// 	if (evt.pass) {
				// 		msg = '[PASS]' + msg;
				// 	} else {
				// 		msg = '[FAIL]' + msg;
				// 	}
				// 	util.log(msg);
				// }
		}));

});

//合并压缩css
gulp.task("minify-css", ["sass"], function(callback) {
	var baseCssUrl = "./public/styles/css/",
		releaseUrl = "./public/release/styles/",
		cssList = {
			login: {
				originFile: ["all.css", "login.css"],
				outFile: "login.min.css"
			},
			main: {
				originFile: ["all.css"],
				outFile: "main.min.css"
			},
			user: {
				originFile: ["all.css", "grid.css"],
				outFile: "user.min.css"
			},
			photo: {
				originFile: ["all.css", "grid.css"],
				outFile: "photo.min.css"
			},
			photoDetail: {
				originFile: ["all.css", "imageviewer.css", "photodetail.css"],
				outFile: "photoDetail.min.css"
			}
		},
		list = [];

	for (var key in cssList) {
		(function(cssList, key) {
			var cssFiles = cssList[key].originFile.map(function(val) {
				return baseCssUrl + val;
			});

			list.push(function(cb) {
				gulp.src(cssFiles)
					.pipe(concat(cssList[key].outFile))
					.pipe(cleanCss({
						keepSpecialComments: 0,
						compatibility: 'ie8'
					}))
					.pipe(ginsert.transform(function(contents, file) {
						util.log("Uglify Css success for path:" + file.path);
						return comments + contents;
					}))
					.pipe(gulp.dest(releaseUrl))
					.on("error", function(err) {
						cb(err);
					})
					.on("end", function() {
						cb(null);
					});
			});
		})(cssList, key);
	}

	async.series(list, function(err) {
		if (err) console.log(err);
		util.log(">>-----------------------------------------------------------uglify css complete");
		callback();
	});
});

//合并压缩html
gulp.task("minify-html", function() {
	return gulp.src('./view/*.html')
		.pipe(minifyhtml())
		.pipe(gulp.dest('./view'));
});

//只重新编译被更改过的文件
gulp.task('rebuild', function() {
	gulp.src('./*.scss')
		.pipe(watch('./*.scss'))
		.pipe(sass())
		.pipe(gulp.dest('./styles'));
});

//压缩requirejs
gulp.task("rjs", function(callback) {
	var baseUrl = "./public/scripts/",
		scriptsList = {
			master: {
				originFile: "app/master/main.js",
				outFile: "master.min.js"
			},
			photo: {
				originFile: "app/photo/main.js",
				outFile: "photo.min.js"
			},
			photoDetail: {
				originFile: "app/photo/detail.js",
				outFile: "detail.min.js"
			},
			user: {
				originFile: "app/user/main.js",
				outFile: "user.min.js"
			}
		},
		config = {
			"baseUrl": baseUrl,
			"optimize": "uglify",
			"exclude": ["bootstrap", "globalConfig", "jquery"],
			"preserveLicenseComments": false, //注释
			"onBuildWrite": function(moduleName, path, contents) {
				console.log("--正在处理模块：" + moduleName + ">>path:-" + path);
				return contents;
			},
			"onModuleBundleComplete": function(data) {
				//最后一个js文件为主入口文件[buildJsFile]
				var buildJsFile = data.included[data.included.length - 1],
					log = ' Uglifying script file >> ' + buildJsFile;
				util.log(log);
			},
			"paths": {
				"jquery": "libs/jquery-1.11.3",
				"bootstrap": "libs/bootstrap",
				"domReady": "libs/domReady",
				"tabPanel": "libs/tabPanel/TabPanel",
				"fader": "libs/tabPanel/Fader",
				"mustache": "libs/private/mustache",
				"jqExtend": "libs/private/jquery.extend",
				"ajax": "libs/private/ajax",
				"blockUI": "libs/blockUI/jquery.blockUI",
				"jqform": "libs/jquery.form",
				"imageLoaded": "libs/private/imageLoaded",
				"imageviewer": "libs/private/imageviewer",
				"paging": "app/common/paging",
				"grid": "app/common/grid",
				"globalConfig": "empty:"
			},
			"shim": {
				"bootstrap": ["jquery"],
				"jqExtend": ["jquery"],
				"imageLoaded": ["jquery"],
				"imageviewer": ["jquery"]
			}
		};

	//一
	// return gulp.src(baseUrl + "app/master/main.js")
	// 	.pipe(amdOptimize("app/master/main", config))
	// 	.pipe(concat("master.min.js"))
	// 	.pipe(uglify())
	// 	.pipe(gulp.dest('./public/release/scripts/'));

	//二
	// rjs(config).pipe(uglify()).pipe(gulp.dest('./public/release/scripts/'));
	// 
	// 三 requirejs
	var list = [],
		keepScope = function(sf) {
			sf.include = sf.originFile;
			sf.out = function(text) {
				fs.writeFile("./public/release/scripts/" + sf.outFile, comments + text, function(err) {
					if (err) {
						util.log(err);
					}
					util.log(sf.outFile + "     --->> success!")
				});
			};
			list.push(function(cb) {
				requirejs.optimize(sf, function(str) {
					cb(null);
				}, function(err) {
					cb(err);
				});
			});
		};
	for (var key in scriptsList) {
		var sf = scriptsList[key];
		copy(config).to(sf);
		keepScope(sf);
	}
	async.series(list, function(err, result) {
		if (err) util.log("async.series:" + err);
		util.log(">>-----------------------------------------------------------uglify js complete");
		callback();
	});
});


//复制文件
gulp.task("copy", ["minify-css", "rjs"], function(cb) {
	gulp.src("./public/res/**/")
		.pipe(copyFile('./public/release/', {
			prefix: 1
		}))
		.on("end", function() {
			util.log(">>-----------------------------------------------------------文件复制完成");
			cb(null);
		});
});

// watchCss.on('change', function(event) {
// 	console.log('file ' + event.path + ' was' + event.type + ' ,runing tasks...');
// });

// gulp.task("sass:watch", function() {
// 	//listener sass change
// 	gulp.watch('./*.scss', ['sass']);
// });

//监听改动后实时刷新
gulp.task("watch", function(cb) {
	// 该插件最好配合谷歌浏览器来使用，且要安装livereload chrome extension扩展插件
	livereload.listen();
	//scss改动时编译css并刷新页面
	watch('./public/styles/*.scss', function() {
		gulp.start('sass');
	});
	//html改动时刷新页面
	watch('./views/**/*.html', function() {
		gulp.src('./views/**/*.html')
			.pipe(livereload());
	});
});


gulp.task('default', ["minify-css", "copy", "rjs"], function() {

});