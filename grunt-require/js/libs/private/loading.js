
define(["globalConfig", "blockUI"], function (globalConfig) {

    var trans = globalConfig.trans.data || {},
        host = globalConfig.context.host,
        msg = "<img src='" + host + "/style/images/loading.gif' />";// '<span style="display:block;line-height:28px;font-family:微软雅黑,font-size:10pt;height:28px;">loading...</span>';//trans[150045]

    var Loading = function (subInstance) {
        var self = this;
        self.subInstances = subInstance || $(document.body);
        self.isClass = !subInstance.jquery;
        self.commonFun = function () {
            $.blockUI({
                message: msg,
                baseZ: 900,
                css: {
                    border: "none",
                    background: "none"
                }
            });
        };

        self.commonFun_self = function () {
            self.subInstances && typeof(self.subInstances.block) == "function" && self.subInstances.block({
                message: msg,
                baseZ: 900,
                css: {
                    border: "none",
                    background: "none"
                }
            });
        };
    };

    Loading.prototype = {

        loadingShow: function (xhr) {
            var self = this;
            if (self.isClass)
                self.commonFun();
            else {
                self.commonFun_self();
            }
        },

        loadingHide: function () {
            var self = this;
            self.xhr = null;
            if (self.isClass) {
                $.unblockUI();
            }
            else {
                self.subInstances && typeof (self.subInstances.unblock) == "function" && self.subInstances.unblock();
            }
        }
    };

    Loading.extend = function (subInstances) {
        var baseInstance;
        for (var i = 0, item; item = subInstances[i]; i++) {
            baseInstance = new Loading(item);
            for (var key in baseInstance) {
                if (!(key in item)) subInstances[i][key] = baseInstance[key];
            }
        }
    }

    return Loading;
});