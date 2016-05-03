
define(["globalConfig", "ajax", "grid", "shoppingCart", "note", "track", "amplify"], function (globalConfig, ajax, Grid, ShoppingCart, Note, track) {

    var defaultOpts = {
        callbacks: {
            onGoToUsage: null
        }
    },
    trans = globalConfig.trans;

    var PartNumberSearch = function (options) {

        this.opts = $.extend({}, defaultOpts, options || {});
        this.init();

    };

    PartNumberSearch.prototype = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.bindEvent();
            self.initComponent();
        },

        bindDomEls: function () {
            var self = this;

            self.$partNumberWrap = $("#part-number-search");
            self.$filter = $("#part-number-search-filter");
            self.$partNumber = self.$filter.find("input[data-field='PartNumber']");
        },

        bindEvent: function () {
            var self = this;
            self.$partNumberWrap.on("mouseover", "[data-ModelNote]", function (e) {
                self.note.delayShow(e, $(this), self.$partNumberWrap.height());
            });

            self.$partNumberWrap.on("mouseout", "[data-ModelNote]", function (e) {
                self.note.delayHide();
            });

            //show number
            $.moveTips(self.$partNumberWrap, "[data-action='move-tip']", $("#move_tip"), {
                callback: {
                    afterStopMove: function ($target) {
                        var name = $target.attr("data-move-name"),
                            partNo = $target.attr("data-id");
                        switch (name) {
                            case "price":
                                track.publish("part", "显示价格", "mouseenter", "view", "PartNumber:" + partNo);
                                break;
                            default:
                        }
                    }
                }
            });


        },

        initComponent: function () {
            var self = this;

            self.grid = new Grid({
                grid: {
                    gridId: "part-number-search-grid",
                    fixedId: "part-number-search-grid-fixed",
                    keys: ["rowNumber"]
                },
                paging: {
                    id: "part-number-search-paging"
                },
                filter: {
                    id: "part-number-search-filter",
                    resetId: "part-number-search-btn-clear",
                    filterId: "part-number-search-btn-filter"
                },
                callbacks: {
                    onLoadDataBefore: function (params) {
                        var partNo = self.$partNumber.val();
                        track.publish("part", "零件编号查询窗口-查询", "click", "view", "PartNumber:" + partNo);
                    },
                    onRowClicked: function (e, cells, keys, action) {
                        var partNumber = cells.PartNumber;

                        if (action === "buy") {
                            self.addtoShoppingCart(partNumber);
                            track.publish("part", "操作列-购买", "click", "view", "PartNumber:" + partNumber);
                        } else {
                            if (cells.ImageCode.length > 0) {
                                self.gotoUsage(cells, partNumber);
                            } else {
                                alert(trans["163"]);
                            }
                        }
                    }
                }
            });

            self.note = new Note();
        },

        addtoShoppingCart: function (partNumber) {
            amplify.publish("buy", partNumber);
        },

        buildFilter: function (partNumber) {
            var self = this;

            self.$partNumber.val(partNumber);
            self.grid.filter();
            self.$partNumberWrap.show();
        },

        gotoUsage: function (cells, partNumber) {
            var self = this,
                nodes = self.getUsageNodes(cells),
                onGoToUsage = self.opts.callbacks.onGoToUsage;

            if (typeof onGoToUsage === "function") {
                onGoToUsage.apply(null, [nodes, partNumber]);
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

        },

        fillFilter: function (params) {
            var self = this;

            for (key in params) {
                self.$filter.find("[data-field='" + key + "']").val(params[key]);
            }

            self.doSearch();
        },

        doSearch: function () {
            var self = this;

            self.grid.filter();
        }

    }

    return PartNumberSearch;
})