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
var pkg = require('./package.json');
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



/**
 * 2016/5/10 根据weiui做的测试
 */
var http = require('http');
var browserSync = require('browser-sync'); // 浏览器同步测试…… http://www.browsersync.cn/docs/gulp/
var nano = require('gulp-cssnano'); //css压缩
var header = require('gulp-header'); //添加信息在头部
var releaseFolder = './release';
var banner = [
	'/*!',
	' * Wei.Yao v<%= pkg.version %> (<%= pkg.homepage %>)',
	' * Copyright <%= new Date().getFullYear() %> Tencent, Inc.',
	' * Licensed under the <%= pkg.license %> license',
	' */',
	''
].join('\n');

//编译sass
gulp.task('build:sass', function() {
	return gulp.src('./*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([autoprefixer]))
		.pipe(header(banner, {
			pkg: pkg
		}))
		.pipe(gulp.dest('./public/styles'))
		.pipe(browserSync.reload({
			stream: true
		}))
		.on("error", function(e) {
			console.log(e.message);
			this.emit('end');
		})
		.on('end', function() {
			console.log('build:sass success!');
		});
	// .pipe(nano())
	// .pipe(rename(function(path) {
	// 	console.log(path.basename);
	// 	path.basename += '.min';

	// }))
	// .pipe(gulp.dest('./public/styles'))
	// .pipe(browserSync.reload({
	// 	stream: true
	// })).on('end', function() {
	// 	console.log('build:sass success!');
	// });
});

//uglify javascript
gulp.task("build:js", function() {
	// gulp.src('styles/(**/*.?(css|*))|*.?(css|*)')
	return gulp.src(['public/js/*.js', 'public/js/**/*.js'], {
			base: 'public'
		})
		.pipe(uglify())
		.pipe(rename(function(path) {
			if (path.basename.indexOf('.min') < 0)
				path.basename += '.min';
		}))
		.pipe(gulp.dest(releaseFolder))
		.pipe(browserSync.reload({
			stream: true
		}))
		.on("error", function(e) {
			console.log(e.message);
			this.emit('end');
		})
		.on('end', function() {
			console.log('build:js success!');
		});
});
//uglify css
gulp.task("build:css", ['build:sass'], function() {
	return gulp.src(['public/styles/*.css', 'public/styles/**/*.css'], {
			base: 'public'
		})
		.pipe(nano())
		.pipe(rename(function(path) {
			if (path.basename.indexOf('.min') < 0)
				path.basename += '.min';
		}))
		.pipe(gulp.dest(releaseFolder))
		.pipe(browserSync.reload({
			stream: true
		}))
		.on("error", function(e) {
			console.log(e.message);
			this.emit('end');
		})
		.on('end', function() {
			console.log('build:css success!');
		});
});

//合并压缩html
gulp.task("build:html", function() {
	return gulp.src('./view/*.html')
		.pipe(minifyhtml())
		.pipe(gulp.dest('./view'))
		.pipe(browserSync.reload({
			stream: true
		})).on("error", function(e) {
			console.log(e.message)
		})
		.on("end", function() {
			console.log("build:html success!")
		});
});

//复制文件到release文件夹
gulp.task("build:assets", ['build:css'], function() {
	//所有public下的文件
	// gulp.src(['public/*.?(jpg|png|gif|js)', 'public/**/*.?(jpg|png|gif|css)'], {
	// 		base: 'public'
	// 	})
	// 	.pipe(gulp.dest(releaseFolder));
	// 	-------------------------------------
	//针对部分文件
	return gulp.src(['public/**/*.?(jpg|png|gif)'], {
			base: 'public'
		})
		.pipe(gulp.dest(releaseFolder))
		.on("error", function(e) {
			console.log(e.message);
			this.emit('end');
		})
		.on('end', function() {
			console.log('build:assets success!');
		});
});


gulp.task('build:watch', function() {
	var gw = gulp.watch(['./*.scss', './view/*.html'], ['build:css']);
	gw.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	var gs = gulp.watch('./public/**/*.css', function(event) {
		console.log('File2 ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});


gulp.task("build:start", ['build:assets', 'build:js', 'build:html'], function() {
	console.log("全部完成!");
});



//通过browser-sync在浏览器中查看，无需另建服务器
gulp.task('server', function() {
	var p = 8050;
	browserSync.init({
		server: {
			baseDir: ""
		},
		ui: {
			port: p,
			weinre: {
				port: p + 2
			}
		},
		port: p,
		startPath: '/view/index.html'
	});

	gulp.start('build:watch');
});



/*------------------------------------------------------------------------------------------------------------------------------------*/