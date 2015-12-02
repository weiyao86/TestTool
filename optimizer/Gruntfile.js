
module.exports = function (grunt) {

    var pkg = grunt.file.readJSON('requireConfig.json');
    var now = new Date();
    var dateFormat = require('dateformat');
    var dateTime = dateFormat(now, "isoDateTime");
    var comments = "/* build date: " + dateTime + " */ ";

    grunt.initConfig({
        requirejs: {
            catalog: {
                options: {
                    baseUrl: "../js/",
                    paths: pkg.paths,
                    shim: pkg.shim,
                    optimize: 'uglify',
                    include: ["app/catalog/main.js"],
                    exclude: ["jqueryDatepickeri18n", "globalConfig", "jquery"],
                    preserveLicenseComments: false,
                    out: function (text, sourceMapText) {
                        var outPath = "../js/release/catalog.min.js";
                        var outText = comments + " " + text;

                        grunt.file.write(outPath, outText);
                    }
                }
            },

            detail: {
                options: {
                    baseUrl: "../js/",
                    paths: pkg.paths,
                    shim: pkg.shim,
                    optimize: 'uglify',
                    include: ["app/detail/main.js"],
                    exclude: ["jqueryDatepickeri18n", "globalConfig", "jquery"],
                    preserveLicenseComments: false,
                    out: function (text, sourceMapText) {
                        var outPath = "../js/release/detail.min.js";
                        var outText = comments + " " + text;

                        grunt.file.write(outPath, outText);
                    }
                }
            },

            message: {
                options: {
                    baseUrl: "../js/",
                    paths: pkg.paths,
                    shim: pkg.shim,
                    optimize: 'uglify',
                    include: ["app/notice/message.js"],
                    exclude: ["jqueryDatepickeri18n", "globalConfig", "jquery"],
                    preserveLicenseComments: false,
                    out: function (text, sourceMapText) {
                        var outPath = "../js/release/message.min.js";
                        var outText = comments + " " + text;

                        grunt.file.write(outPath, outText);
                    }
                }
            },

            bulletin: {
                options: {
                    baseUrl: "../js/",
                    paths: pkg.paths,
                    shim: pkg.shim,
                    optimize: 'uglify',
                    include: ["app/notice/bulletin.js"],
                    exclude: ["jqueryDatepickeri18n", "globalConfig", "jquery"],
                    preserveLicenseComments: false,
                    out: function (text, sourceMapText) {
                        var outPath = "../js/release/bulletin.min.js";
                        var outText = comments + " " + text;

                        grunt.file.write(outPath, outText);
                    }
                }
            },

            order: {
                options: {
                    baseUrl: "../js/",
                    paths: pkg.paths,
                    shim: pkg.shim,
                    optimize: 'uglify',
                    include: ["app/order/main.js"],
                    exclude: ["jqueryDatepickeri18n", "globalConfig", "jquery"],
                    preserveLicenseComments: false,
                    out: function (text, sourceMapText) {
                        var outPath = "../js/release/order.min.js";
                        var outText = comments + " " + text;

                        grunt.file.write(outPath, outText);
                    }
                }
            },

            orderManager: {
                options: {
                    baseUrl: "../js/",
                    paths: pkg.paths,
                    shim: pkg.shim,
                    optimize: 'uglify',
                    include: ["app/orderManager/main.js"],
                    exclude: ["jqueryDatepickeri18n", "globalConfig", "jquery"],
                    preserveLicenseComments: false,
                    out: function (text, sourceMapText) {
                        var outPath = "../js/release/orderManager.min.js";
                        var outText = comments + " " + text;

                        grunt.file.write(outPath, outText);
                    }
                }
            },

            partNote: {
                options: {
                    baseUrl: "../js/",
                    paths: pkg.paths,
                    shim: pkg.shim,
                    optimize: 'uglify',
                    include: ["app/partNote/main.js"],
                    exclude: ["jqueryDatepickeri18n", "globalConfig", "jquery"],
                    preserveLicenseComments: false,
                    out: function (text, sourceMapText) {
                        var outPath = "../js/release/partNote.min.js";
                        var outText = comments + " " + text;

                        grunt.file.write(outPath, outText);
                    }
                }
            },

            shoppingCart: {
                options: {
                    baseUrl: "../js/",
                    paths: pkg.paths,
                    shim: pkg.shim,
                    optimize: 'uglify',
                    include: ["app/shoppingCart/main.js"],
                    exclude: ["jqueryDatepickeri18n", "globalConfig", "jquery"],
                    preserveLicenseComments: false,
                    out: function (text, sourceMapText) {
                        var outPath = "../js/release/shoppingCart.min.js";
                        var outText = comments + " " + text;

                        grunt.file.write(outPath, outText);
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // 注册一个默认的任务
    grunt.registerTask('default', ['requirejs']);

}