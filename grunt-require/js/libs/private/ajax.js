/*
 name: jQuery ajax
 desc: Packaging the jquery ajax method
*/
define(["globalConfig"], function (globalConfig) {

    var i18n = {
        "zh_CN": {
            "100": "未知错误",
            "101": "被请求的页面需要用户名和密码",
            "102": "请求未完成,服务器遇到不可预知的情况"
        },
        "en_US": {
            "100": "Unknown error",
            "101": "The requested page needs a username and password",
            "102": "The request was not completed, the server encounters unpredictable circumstances"
        }
    };

    var trans = i18n[globalConfig.context.lang || "zh_CN"];

    var defaultOpts = {
        cache: true,
        data: {},
        timeout: 60000,
        dataType: "json",
        type:"POST",
        traditional: false
    };

    return {
        /**
         * To encapsulate the jquery ajax main method.
         * @param {object} options is ajax configuration parameters.
         * @return {object} Throw an XHR object.
         */
        "invoke": function (options) {
            var self = this,
                opts = $.extend({}, defaultOpts, options || {}),
                jqXHR = $.ajax({
                    url: opts.url,
                    contentType: opts.contentType,
                    type: opts.type,
                    cache: opts.cache,
                    data: opts.data,
                    timeout: opts.timeout,
                    dataType: opts.dataType,
                    beforeSend: opts.beforeSend,
                    complete: opts.complete,
                    traditional: opts.traditional,
                    success: function (result) {
                        self.success(opts, result);
                    },
                    error: function (error) {
                        self.error(opts, error);
                    }
                });

            return jqXHR;
        },

        /**
         * The callback function called ajax request is success.
         * @param {object} options is ajax configuration parameters.
         * @param {object} The server returns the result
         */
        "success": function (options, result) {
            var self = this,
                result = result || {};

            if (result.success || result.IsSuccess) {
                if (typeof options.success === "function") {
                    options.success.apply(self, [result]);
                }
            } else {
                self.failed(options, result.msg || result.ErrorMessage || trans["100"]);
            }
        },

        /**
         * The callback function called ajax request is error.
         * @param {object} options is ajax configuration parameters.
         * @param {object} The server returns the error info
         */
        "error": function (options, error) {
            var self = this,
                errorMessage = error.status + ", " + error.statusText;

            switch (error.status) {
                case 0:
                    break;
                case 401:
                    alert(trans["101"]);
                    location.href = location.href;
                    break;
                case 500:
                    alert(trans["102"]);
                    break;
                default:
                    if (typeof options.failed === "function") {
                        options.failed.apply(self, [{ reason: errorMessage }]);
                    }
                    break;
            };

            // TODO
            // In the future will be written to the log
            // Tracker.log(errorMessage);
        },

        /**
         * The callback function called ajax request is failed.
         * @param {object} options is ajax configuration parameters.
         * @param {string} The server returns the error message
         */
        "failed": function (options, errorMessage) {
            var self = this;
            
            if (typeof options.failed === "function") {
                options.failed.apply(self, [{ reason: errorMessage}]);
            }
        }
    };

});