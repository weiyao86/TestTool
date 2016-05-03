
define(["globalConfig", "ajax", "grid", "shoppingCart", "note", "track", "jqExtend", "amplify", "jqueryEasyUI"], function (globalConfig, ajax, Grid, ShoppingCart, Note, track) {
    var CATALOGS = ["brand", "series", "year", "model", "group", "image"],
        defaultOpts = {
            callbacks: {
                onGoToUsage: null
            }
        },
        trans = globalConfig.trans;

    var AdvancedSearch = function (options) {
        this.opts = $.extend({}, defaultOpts, options || {});

        this.init();
    };

    AdvancedSearch.prototype = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.initComponent();
            self.bindEvent();
        },

        bindDomEls: function () {
            var self = this;

            self.$grid = $("#advanced-search-grid");
            self.$filter = $("#advanced-search-filter");
            self.$advancedSearch = $("#advanced-search");
        },

        bindEvent: function () {
            var self = this;
            self.$grid.on("mouseover", "[data-ModelNote]", function (e) {
                self.note.delayShow(e, $(this), self.$grid.height());
            });

            self.$grid.on("mouseout", "[data-ModelNote]", function (e) {
                self.note.delayHide();
            });

            //show number
            $.moveTips(self.$advancedSearch, "[data-action='move-tip']", $("#move_tip"), {
                callback: {
                    afterStopMove: function ($target) {
                        var name = $target.attr("data-move-name"),
                            partNo = $target.attr("data-id");
                        switch (name) {
                            case "price":
                                track.publish("advance", "显示价格", "mouseenter", "view", "PartNumber:" + partNo);
                                break;
                            default:
                        }
                    }
                }
            });

        },

        initComponent: function () {
            var self = this;

            // 异步初始化 easyui combobx, 避免发生两次请求
            window.setTimeout(function () {
                self.initCombobox();
            }, 50);
            self.initGrid();
            self.note = new Note();
        },

        initGrid: function () {
            var self = this;

            self.grid = new Grid({
                grid: {
                    gridId: "advanced-search-grid",
                    fixedId: "advanced-search-grid-fixed",
                    keys: ["rowNumber"]
                },
                paging: {
                    id: "advanced-search-paging"
                },
                filter: {
                    id: "advanced-search-filter",
                    resetId: "advanced-search-btn-clear",
                    filterId: "advanced-search-btn-filter"
                },
                callbacks: {
                    onLoadDataBefore: function (params) {
                        track.publish("advance", "高级查询窗口-查询", "click", "view", params);
                    },
                    onRowClicked: function (e, cells, keys, action) {
                        var $target = $(e.target),
                            partNumber = $target.attr("data-PartNumber");
                        switch (action) {
                            case 'buy':
                                self.addtoShoppingCart(partNumber);
                                track.publish("advance", "高级查询窗口-购买", "click", "view", { PartNumber: partNumber });
                                break;
                            default:
                                if (cells.ImageCode.length > 0) {
                                    self.gotoUsage(cells);
                                } else {
                                    alert(trans["163"]);
                                }
                        }

                    }
                }
            });
        },

        addtoShoppingCart: function (partNumber) {
            amplify.publish("buy", partNumber);
        },

        initCombobox: function () {
            var self = this,
                $brand = $("#brand-cbx"),
                $series = $("#series-cbx"),
                $comboboxs = self.$filter.find(".easyui-combobox");

            $comboboxs.each(function () {
                var $target = $(this),
                    type = $target.attr("data-type"),
                    url = globalConfig.actions[type];

                $target.combobox({
                    method: "get",
                    valueField: "Code",
                    textField: "CodeDesc",
                    onLoadSuccess: function () {
                        self.setCombobox($target);
                    },
                    onLoadError: function () {
                        self.setCombobox($target);
                    },
                    onSelect: function () {
                        self.resetCombobox($target);
                    },
                    loadFilter: $.proxy(self.loadFilter, self)
                }).next("span").on("click", function () {
                    self.reloadCombobox($target);
                });
            });
        },

        setCombobox: function ($target) {
            var self = this,
                type, params = self.defaultParams;

            if (!params) return;

            if (!$.isEmptyObject(params)) {
                type = $target.attr("data-type");
                $target.combobox("setValue", params[type]);
                delete params[type];
            }
            if ($.isEmptyObject(params)) {
                self.defaultParams = null;
                self.doSearch();
            }
        },

        reloadCombobox: function ($target) {
            var self = this,
                type = $target.attr("data-type"),
                url = globalConfig.actions[type],
                params = self.getParams($target);

            $target.combobox("reload", url + params);
        },

        loadFilter: function (result) {
            var self = this,
                allOption = { Code: "", Description: trans["157"] };

            return result.Data.data;
        },

        getParams: function ($target) {
            var self = this,
                field, value, params = [],
                type = $target.attr("data-type"),
                $select = self.$filter.find("[data-type]"),
                curIndex = $.inArray(type, CATALOGS);

            $select.each(function (index) {
                if (index >= curIndex) return false;
                field = $(this).attr("data-field");
                value = $(this).combobox("getValue");
                params.push(field + "=" + value);
            });

            return params.length > 0 ? "&" + params.join("&") : "";
        },

        gotoUsage: function (cells) {
            var self = this,
                partNumber = cells.PartNumber,
                nodes = self.getUsageNodes(cells),
                onGoToUsage = self.opts.callbacks.onGoToUsage;

            if (typeof onGoToUsage === "function") {
                onGoToUsage.apply(self, [nodes, partNumber]);
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
            var self = this, $combobox;

            self.defaultParams = params;

            for (var key in params) {
                $combobox = self.$filter.find("[data-type='" + key + "']");
                self.reloadCombobox($combobox);
            }
        },

        doSearch: function () {
            var self = this;

            self.grid.filter();
        },

        resetCombobox: function ($target) {
            var self = this, $combobox,
                type = $target.attr("data-type"),
                i = $.inArray(type, CATALOGS) + 1;

            for (; i < CATALOGS.length; i++) {
                $combobox = self.$filter.find("[data-type='" + CATALOGS[i] + "']");
                $combobox.combobox("setValue", "");
            }
        }
    }

    return AdvancedSearch;
})