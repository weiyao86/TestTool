module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		sass: {
			dist: {
				options: {
					sourcemap: 'none',
					style: 'compact'
				},
				expand: true,
				cwd: 'public/styles/',
				src: '*.scss',
				ext: '.css',
				dest: 'public/styles/css/'
			}
		},
		//监听模式
		watch: {
			css: {
				files: ["public/styles/css/*.css"],
				options: {
					livereload: true
				}
			},
			sass: {
				files: ['public/styles/*.scss'],
				tasks: ['sass'],
				options: {
					livereload: false
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.registerTask("default", ["sass"]);
	grunt.registerTask("watch-ck", ["watch"]);
};