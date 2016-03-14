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

var watchCss = gulp.watch('./styles/*.css');

var dateFormat = require('dateformat');
var now = new Date();
var dateTime = dateFormat(now, "isoDateTime");
var comments = "/* build date: " + dateTime + " */ \n";
//build sass
gulp.task("sass", function() {
	//.pipe(sass({outputStyle: 'extend'})compressed
	gulp.src('./*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([autoprefixer]))
		.pipe(gulp.dest('./styles'))
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
		.pipe(postcss([autoprefixer]))
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
	watch('./*.scss', function() {
		gulp.start('sass');
	});
	//html改动时刷新页面
	watch('./view/*.html', function() {
		gulp.src('./view/*.html')
			.pipe(livereload());
	});
});



gulp.task('default', ["minify-html", "minify-css", "uglify"], function() {


	fs.readFile('./release/js/custom.min.js', function(err, data) {
		fs.writeFile('./release/js/custom.min.js', comments + ' ' + data, function(err1) {
			console.log(arguments);
		});
	});

});