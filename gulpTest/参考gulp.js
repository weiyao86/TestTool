'use strict';

var fs = require('fs'),
	now = new Date(),
	async = require('async'),
	copy = require('copy-to'),
	requirejs = require('requirejs'),
	dateFormat = require('dateformat'),
	concat = require('gulp-concat'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	ginsert = require('gulp-insert'),
	cmdExec = require('child_process').exec;

var now = new Date(),
	comments = "/* build date: " + dateFormat(now, "isoDateTime") + " */ ";

module.exports = function(gulp, srcConfig, cssConfig, scriptsConfig, requireConfig) {

	var releasePath = srcConfig.projectBaseURI + srcConfig.releaseFolder;

	var utils = {
		outFile: function(filename, text) {
			var self = this,
				path = releasePath + srcConfig.scriptsDest;

			fs.writeFile(path + filename, comments + text, function(err) {
				if (err) {
					self.sendLog(filename + ':' + err);
				}
			});
		},
		sendLog: function(log) {
			if (process && process.send) {
				process.send(log);
			} else {
				console.log(log);
			}
		}
	};

	// git pull
	gulp.task('git pull', function(callback) {
		var cmd = ' cd ' + srcConfig.projectBaseURI + ' && git pull origin master ';

		cmdExec(cmd, function(err, stdout, stderr) {
			utils.sendLog('git pull err :' + err);
			utils.sendLog('git pull stdout :' + stdout);
			utils.sendLog('git pull stderr :' + stderr);
			callback();
		});
	});

	// tfs get all
	gulp.task('tfs checkout', function(callback) {
		var cmd = ' tf get ' + srcConfig.projectBaseURI + ' /r ' +
			' && tf checkout ' + releasePath + ' /r';

		cmdExec(cmd, function(err, stdout, stderr) {
			utils.sendLog('tf get err :' + err);
			utils.sendLog('tf get stdout :' + stdout);
			utils.sendLog('tf get stderr :' + stderr);
			callback();
		});
	});

	// build js file
	gulp.task('scripts', srcConfig.dependTasks, function(callback) {
		var series = [],
			baseConfig = {
				baseUrl: srcConfig.projectBaseURI + srcConfig.scriptsSrc,
				paths: requireConfig.paths,
				shim: requireConfig.shim,
				optimize: 'uglify',
				preserveLicenseComments: false,
				exclude: srcConfig.excludeModules,
				onBuildWrite: function(moduleName, path, contents) {
					var log = '>> Tracing dependencies for:' + moduleName;

					utils.sendLog(log);
					return contents;
				},
				onModuleBundleComplete: function(data) {
					var buildJsFile = data.included[data.included.length - 1],
						log = ' Uglifying script file >> ' + buildJsFile;

					utils.sendLog(log);
				}
			};

		for (let key in scriptsConfig) {
			scriptsConfig[key].out = function(text) {
				utils.outFile(scriptsConfig[key].outFile, text);
			}
			copy(baseConfig).to(scriptsConfig[key]);
			series.push(function(cb) {
				requirejs.optimize(scriptsConfig[key], function() {
					cb(null);
				}, function(err) {
					cb(err);
				});
			});
		}

		async.series(series, function(err, values) {
			if (err) {
				utils.sendLog('script optimizer err:' + err)
			} else {
				utils.sendLog('>>> script uglify optimizer done');
			}
			callback();
		});
	});

	// build css file
	gulp.task('cssmin', srcConfig.dependTasks, function(callback) {
		var series = [],
			outPath = releasePath + srcConfig.stylesDest,
			srcPath = srcConfig.projectBaseURI + srcConfig.stylesSrc;

		for (let key in cssConfig.paths) {
			series.push(function(cb) {

				var cssFiles = cssConfig.paths[key].map(function(item) {
					return srcPath + item;
				});
				gulp.src(cssFiles)
					.pipe(minifycss({
						keepSpecialComments: 0,
						compatibility: 'ie8'
					}))
					.pipe(autoprefixer())
					.pipe(concat(key))
					.pipe(ginsert.transform(function(contents, file) {
						var log = ' Minifying css file >> ' + file.path;
						utils.sendLog(log);
						return comments + contents;
					}))
					.pipe(gulp.dest(outPath))
					.on('error', function(err) {
						cb(err);
					}).on('end', function() {
						cb(null);
					});
			});
		}

		async.series(series, function(err) {
			if (err) {
				utils.sendLog('css optimizer err:' + err)
			} else {
				utils.sendLog(' >>> css minifycss optimizer done');
			}
			callback();
		});
	});

	// copy img file
	gulp.task('imgcopy', srcConfig.dependTasks, function(callback) {
		var outPath = releasePath + srcConfig.stylesDest + srcConfig.imagesDest,
			srcPath = srcConfig.projectBaseURI + srcConfig.stylesSrc + srcConfig.imagesSrc;

		gulp.src(srcPath + "*")
			.pipe(gulp.dest(outPath))
			.on('end', function() {
				var log = ">>> copy style folder images to release styles done";
				utils.sendLog(log);
				callback();
			});
	});

	// git commit push
	gulp.task('git commit push', ['scripts', 'cssmin', 'imgcopy'], function() {
		var cmd = ' cd ' + srcConfig.projectBaseURI +
			' && ' + srcConfig.projectBaseURI.substring(0, 2) +
			' && git add -A ' +
			' && git commit -a -m "压缩合并脚本与样式:' + dateFormat(now, "isoDateTime") + '"' +
			' && git push origin master';

		cmdExec(cmd, function(err, stdout, stderr) {
			utils.sendLog('err: ' + err);
			utils.sendLog('stdout: ' + stdout);
			utils.sendLog('stderr: ' + stderr);
		});
	});

	// tfs check in
	gulp.task('tfs checkin', ['scripts', 'cssmin', 'imgcopy'], function() {
		var cmd = ' cd ' + releasePath +
			' && ' + releasePath.substring(0, 2) +
			' && tf checkin /r /c:压缩合并脚本与样式:' + dateFormat(now, "isoDateTime") + ' /noprompt';

		cmdExec(cmd, function(err, stdout, stderr) {
			utils.sendLog('tf checkout err :' + err);
			utils.sendLog('tf checkout stdout :' + stdout);
			utils.sendLog('tf checkout stderr :' + stderr);
		});
	});

	return gulp;
}