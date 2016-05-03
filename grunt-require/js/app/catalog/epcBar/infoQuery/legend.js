
define(["globalConfig", "ajax", "grid","track"], function (globalConfig, ajax, Grid,track) {

    var defaultOpts = {
        callbacks: {
            onGoToUsage: null
        }
    },
    trans = globalConfig.trans;

    var LegendSearch = function (options) {

        this.opts = $.extend({}, defaultOpts, options || {});
        this.init();

    };

    LegendSearch.prototype = {

        init: function () {
            var self = this;
            self.buildDom();
            self.initComponent();
        },

        buildDom: function () {
            var self = this;
            self.$legendNo = $("#legend-search [data-field='ImageCode']");
        },

        initComponent: function () {
            var self = this;

            self.grid = new Grid({
                grid: {
                    gridId: "legend-search-grid",
                    keys: ["rowNumber"]
                },
                paging: {
                    id: "legend-search-paging"
                },
                filter: {
                    id: "legend-search-filter",
                    resetId: "legend-search-btn-clear",
                    filterId: "legend-search-btn-filter"
                },
                callbacks: {
                    onLoadDataBefore: function (params) {
                        var legendNo = self.$legendNo.val();
                        track.publish("legend", "图例编号查询窗口-查询", "click", "view", { ImageCode: legendNo });

                    },
                    onRowClicked: function (e, cells, keys, action) {
                        if (action === "go-to-usage") {
                            self.gotoUsage(cells);
                        }
                    }
                }
            });
        },

        gotoUsage: function (cells) {
            var self = this,
                nodes = self.getUsageNodes(cells),
                onGoToUsage = self.opts.callbacks.onGoToUsage;

            if (typeof onGoToUsage === "function") {
                onGoToUsage.apply(null, [nodes]);
            }

        },

        getUsageNodes: function (cells) {
            var self = this;

            return [{
                "type": "brand",
                "next": "series",
                "label": trans["59"],
                "code": cells.BrandCode,
                "text": cells.BrandDesc || cells.BrandCode
            }, {
                "type": "series",
                "next": "year",
                "label": trans["60"],
                "code": cells.CatalogCode,
                "text": cells.CatalogCode + "-" + cells.CatalogDesc
            }, {
                "type": "year",
                "next": "model",
                "label": trans["164"],
                "code": "",
                "text": trans["165"]
            }, {
                "type": "model",
                "next": "group",
                "label": trans["43"],
                "code": "",
                "text": trans["166"]
            }, {
                "type": "group",
                "next": "image",
                "label": trans["63"],
                "code": cells.GroupCode,
                "text": cells.GroupCode + "-" + cells.GroupDesc
            }, {
                "type": "image",
                "next": "usage",
                "label": trans["167"],
                "code": cells.ImageCode,
                "text": cells.ImageCode + "-" + cells.ImageDesc
            }]

        }

    }

    return LegendSearch;
})