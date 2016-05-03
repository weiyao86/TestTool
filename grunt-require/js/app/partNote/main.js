
require(["globalConfig", "ajax", "grid", "track", "jqueryDatepickeri18n", "initMasterCmp", "uniqueLogin", "jquery", "domReady!"], function (globalConfig, ajax, Grid, track) {

    var partNote = {

        init: function () {
            var self = this;

            self.initComponent();
        },

        initComponent: function () {
            var self = this;

            self.grid = new Grid({
                grid: {
                    sort: [{ "Field": "PartNumber", "Order": 0 },{ "Field": "NoteType", "Order": 0 }, { "Field": "CreateDate", "Order": 0 }]
                },
                callbacks: {
                    onLoadDataBefore: function (params) {
                        track.publish("usernote", "查询", "click", "view", params);
                    }
                }
            });
        }

    }

    partNote.init();

});