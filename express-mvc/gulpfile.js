var fs = require("fs");
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var concat = require('gulp-concat');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var rjs = require('gulp-requirejs');
var amdOptimize = require('amd-optimize');

var watchCss = gulp.watch('./public/styles/*.css');

var dateFormat = require('dateformat');
var now = new Date();
var dateTime = dateFormat(now, "isoDateTime");
var comments = "/* build date: " + dateTime + " */ \n";
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

//合并压缩css
gulp.task("minify-css", ["sass"], function() {
	return gulp.src('./styles/all.css')
		.pipe(concat('all.css'))
		.pipe(minifycss())
		.pipe(gulp.dest('./release/styles'));
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

gulp.task("rjs", function() {
	//一次只能做一个压缩任务  WHY？？还没找到方法同时做多个任务
	var baseUrl = "./public/scripts/",
		scriptsList = {
			master: "app/master/main.js",
			photo: "app/photo/main.js",
			photoDetail: "app/photo/detail.js",
			user: "app/user/main.js"
		},
		config = {
			"baseUrl": baseUrl,
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



	config["out"] = 'master.min.js';
	config["include"] = ['app/master/main.js'];
	config["exclude"] = ["bootstrap", "globalConfig", "jquery"];

	//一
	return gulp.src(baseUrl + "app/master/main.js")
		.pipe(amdOptimize("app/master/main", config))
		.pipe(concat("master.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest('./public/release/scripts/'));

	//二
	// rjs(config).pipe(uglify()).pipe(gulp.dest('./public/release/scripts/'));
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



gulp.task('default', ["minify-html", "minify-css", "uglify"], function() {


	// fs.readFile('./release/js/custom.min.js', function(err, data) {
	// 	fs.writeFile('./release/js/custom.min.js', comments + ' ' + data, function(err1) {
	// 		console.log(arguments);
	// 	});
	// });

});