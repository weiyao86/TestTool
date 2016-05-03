define(["advancedSearch", "legend", "info", "part", "superSession", "vsn", "vin", "track", "jqExtend"],
    function (AdvancedSearch, Legend, Info, Part, SuperSession, VSN, VIN, track) {

        var defaultOpts = {
            callbacks: {
                onVsnAndVinToCatalog: null,
                onGoToUsage: null
            }
        };

        var InfoQuery = function (options) {

            this.opts = $.extend({}, defaultOpts, options || {});
            this.init();
        };

        InfoQuery.prototype = {

            init: function () {
                var self = this;

                self.buildDomEls();
                self.bindEvent();
                self.initComponent();
                self.subscribe();
                self.querySelectionNode();
            },

            buildDomEls: function () {
                var self = this;

                self.$infoQueryList = $("#info-query-list");
                self.$infoQueryWrap = $("#info-query-wrap");
                self.$closeQuery = $("#close-query");
                self.$queryIframe = $("#info-query-iframe");
                self.$advancedSearchFilter = $("#advanced-search").find("#advanced-search-filter");
            },

            bindEvent: function () {
                var self = this;

                self.$infoQueryList.on("click", "li[data-area]", function (e) {
                    var flag = $(this).attr("data-area");
                    self.judge(flag);
                    if ($(this).find('a.link').size()) {
                        track.publish("header", "更多查询-" + $(this).text(), "click", "link", $(this).find('a.link').attr("href"));
                    }
                    else
                        track.publish("header", "更多查询-" + $(this).text(), "click", "open", $(this).text());
                });

                self.$closeQuery.on("click", function () {
                    self.slideIn();
                });

                //show note
                $.moveTips(self.$infoQueryWrap, "[data-action='move-tip']", $("#move_tip"), {
                    "isTitle": true
                });
            },

            initComponent: function () {
                var self = this;

                self.advancedSearch = new AdvancedSearch({
                    callbacks: {
                        onGoToUsage: function (nodes, partNumber) {
                            self.goToUsage(nodes, partNumber);
                            var trackParams = { source: "高级查询", args: { partNumber: partNumber, nodes: nodes } };
                            track.publish("legendData", "跳转至左图右数据", "click", "view", trackParams);
                        }
                    }
                });

                self.legend = new Legend({
                    callbacks: {
                        onGoToUsage: function (nodes) {
                            self.goToUsage(nodes);
                            var trackParams = { source: "图例编号查询", args: {nodes: nodes } };
                            track.publish("legendData", "跳转至左图右数据", "click", "view", trackParams);
                        }
                    }
                });

                self.info = new Info();

                self.part = new Part({
                    callbacks: {
                        onGoToUsage: function (nodes, partNumber) {
                            self.goToUsage(nodes, partNumber);
                            var trackParams = { source: "零件编号查询", args: { partNumber: partNumber, nodes: nodes } };
                            track.publish("legendData", "跳转至左图右数据", "click", "view", trackParams);
                        }
                    }
                });

                self.supperSession = new SuperSession({
                    callbacks: {
                        onSearch: function (params) {
                            self.slideOut("part-number-search");
                            self.searchToggle(params, self.part);

                            var trackParams = { source: "替换关系查询", args: params };
                            track.publish("part", "跳转至零件号查询窗口", "click", "view", trackParams);
                        }
                    }
                }),

                self.vsn = new VSN({
                    infoQueryWrap: self.$infoQueryWrap,
                    callbacks: {
                        onSearch: function (params) {
                            self.advancedSearch.fillFilter(params);
                            self.slideOut("advanced-search");

                            var trackParams = { source: "vsn查询", args: params };
                            track.publish("advance", "跳转至高级查询", "click", "view", trackParams);
                        },
                        onCatalogGoTo: function (nodes) {
                            self.vsnAndVinToCatalog(nodes);
                            var trackParams = { source: "vsn查询", args: {nodes: nodes } };
                            track.publish("group", "跳转至分组页面", "click", "view", trackParams);
                        }
                    }
                });

                self.vin = new VIN({
                    infoQueryWrap: self.$infoQueryWrap,
                    callbacks: {
                        onSearch: function (params) {
                            self.advancedSearch.fillFilter(params);
                            self.slideOut("advanced-search");

                            var trackParams = { source: "vin查询", args: params };
                            track.publish("advance", "跳转至高级查询", "click", "view", trackParams);
                        },
                        onCatalogGoTo: function (nodes) {
                            self.vsnAndVinToCatalog(nodes);
                            var trackParams = { source: "vin查询", args: { nodes: nodes } };
                            track.publish("group", "跳转至分组页面", "click", "view", trackParams);
                        }
                    }
                });


            },

            subscribe: function () {
                var self = this;

                amplify.subscribe("go-to-supersession", function (params) {
                    self.slideOut("super-session-search");
                    self.supperSession.fillFilter(params);
                })
            },

            querySelectionNode: function () {
                var self = this;

                if (self.action) {
                    self.clearSelectionNode();
                    self.$infoQueryList.find("[data-area='" + self.action + "']")
                                  .addClass("info-query-list-active");
                }
            },

            clearSelectionNode: function () {
                var self = this;

                self.$infoQueryList.find("[data-area]")
                                  .removeClass();
            },

            judge: function (flag) {
                var self = this;

                if (self.$infoQueryWrap.is(":visible")) {
                    self.toggle(flag);
                } else {
                    self.slideOut(flag);
                }
            },

            toggle: function (flag) {
                var self = this;

                if (flag !== self.action) {
                    self.slideOut(flag);
                } else {
                    self.slideIn();
                }
            },

            slideIn: function () {
                var self = this,
                    right = "-" + self.$infoQueryWrap.width() + "px";

                self.$queryIframe.hide();
                self.$infoQueryWrap.animate({ "right": right }, function () {
                    $(this).hide();
                });

                self.clearSelectionNode();
            },

            slideOut: function (flag) {
                var self = this,
                    wrap = self.$infoQueryWrap;

                wrap.find("div[data-area]").hide();
                wrap.find("[data-area='" + flag + "']").show();
                wrap.show().animate({ "right": "0px" });
                self.$queryIframe.show();

                self.action = flag;
                self.querySelectionNode();
            },

            searchToggle: function (params, obj) {
                var self = this;

                obj.fillFilter(params);
            },

            vsnAndVinToCatalog: function (nodes) {
                var self = this,
                    goToCatalog = self.opts.callbacks.onVsnAndVinToCatalog;

                if (typeof goToCatalog === "function") {
                    goToCatalog.apply(null, [nodes]);
                }
            },

            goToUsage: function (nodes, partNumber) {
                var self = this;

                if (typeof self.opts.callbacks.onGoToUsage === "function") {
                    self.opts.callbacks.onGoToUsage.apply(self, [nodes, partNumber]);
                }
            }

        };

        return InfoQuery;
    });