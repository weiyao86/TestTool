
require(["globalConfig", "ajax", "grid", "track", "uniqueLogin", "initMasterCmp","jquery", "domReady!"], function (globalConfig, ajax, Grid, track) {

    var message = {

        init: function () {
            var self = this;

            self.bindEvent();
            self.initComponent();
        },

        bindEvent: function () {
            var self = this;
            $("#grid").on("click", "a[data-action='detail']", function () {
                track.publish("bulletin", "通讯文件", "click", "link", $(this).attr("href"));
            });
        },

        initComponent: function () {
            var self = this;

            self.grid = new Grid({
                callbacks: {
                    onLoadDataBefore: function (params) {
                        track.publish("message", "查询", "click", "view", params);
                    }
                }
            });

            self.grid.filter();
        }

    }

    message.init();

});