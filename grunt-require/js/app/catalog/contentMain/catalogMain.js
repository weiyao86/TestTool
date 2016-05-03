
define(["globalConfig", "ajax", "loading", "mustache", "track", "json2"], function (globalConfig, ajax, Loading, Mustache, track) {

    var defaults = {
        nodes: {
            brand: "brand",
            catalog: "catalog",
            year: "year",
            model: "model"
        },
        callbacks: {
            onClickNode: null
        }
    };

    var CataLogMain = function (opts) {
        this.opts = $.extend({}, defaults, opts);
        this.getYearAndModelUrl = globalConfig.actions.getYearAndModel;
        this.init();
    }

    CataLogMain.prototype = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.extend();
            self.bindEvent();
            self.pageLoad();
        },

        bindDomEls: function () {
            var self = this;
            self.$mainCatalog = $("#main_catalog");
            self.$view = self.$mainCatalog.find("[data-view]");
            self.$yearWrap = $("#year_wrap");
            self.$modelWrap = $("#model_wrap");
            self.$year = $("#year_pl");
            self.yearTemplate = $("#year_template").html();
            self.$model = $("#model_pl");
            self.modelTemplate = $("#model_template").html();

            self.dataModels = [];
            self.oneParams = self.opts.urlParams;
            self.navData = {};
            self.tabId = "";

        },

        extend: function () {
            var self = this;
            Loading.extend([self, self.$yearWrap, self.$modelWrap]);
        },

        bindEvent: function () {
            var self = this, $this;

            self.$mainCatalog.on("click", "a[data-menu]", function () {
                var brand = $(this).attr("data-id");
                self.selectBrand(this);
                track.publish("homePage", "品牌", "click", "view", "BrandCode:" + brand);
            });

            self.$mainCatalog.on("click", "[data-view] li", function () {
                var params = {
                    "BrandCode": self.tabId,
                    "CatalogCode": $(this).attr("data-id")
                };

                self.launchView($(this));

                track.publish("homePage", "车系", "click", "view", JSON.stringify(params));

                delete self.navData[self.tabId]["Year"];
                delete self.navData[self.tabId]["Year-Model"];

            });

            self.$year.on("click", "li", function () {
                var $li = $(this),
                    yearCode = $li.attr("data-id"),
                    txt = $li.attr("data-text"), params;

                $li.addClass("checked").siblings().removeClass("checked");

                self.navData[self.tabId]["Year"] = yearCode;

                self.loadModel(yearCode, txt);

                params = {
                    "BrandCode": self.tabId,
                    "CatalogCode": self.navData[self.tabId]["CatalogCode"],
                    "Year": yearCode
                }
                track.publish("homePage", "年份", "click", "view", JSON.stringify(params));
            });

            self.$model.on("click", "li", function () {
                track.publish("homePage", "车型", "click", "link", $(this).find('a').attr('href'));
            });
        },

        selectBrand: function (sender) {
            var self = this,
                $this = $(sender),
                view = $this.attr("data-menu"),
                id = $this.attr("data-id");

            $this.addClass("checked").siblings().removeClass("checked");

            self.selectorView(view);

            self.callBackFn({
                id: id,
                name: self.opts.nodes.brand,
                text: $this.html(),
                keys: {
                    "BrandCode": id
                }
            });
            self.tabId = id;
            if (!self.navData[id]) self.navData[id] = {};

            self.navData[id]["BrandCode"] = id;
        },

        //set navNode param
        callBackFn: function (params) {
            var self = this;
            if (typeof self.opts.callbacks.onClickNode === "function") {
                self.opts.callbacks.onClickNode.call(self, params);
            }
        },

        pageLoad: function () {
            var self = this,
                $tabMenu = self.$mainCatalog.find("a[data-menu]"),
                $clLi = self.$mainCatalog.find("ul[data-view]"),
                $modelLi = self.$model.find("li"),
                urlParams = self.oneParams,
                brandCode = urlParams["BrandCode"];
            if (urlParams && brandCode) {
                $tabMenu.filter("[data-menu='" + brandCode + "']").addClass("checked").siblings().removeClass("checked");
                $clLi.filter("[data-view='" + brandCode + "']").find("li[data-id='" + urlParams["CatalogCode"] + "']").addClass("checked").siblings().removeClass("checked");
            }
            var $stMenu = self.$mainCatalog.find("a[data-menu].checked");
            self.tabId = $stMenu.attr("data-id");
            self.selectBrand($stMenu);
        },

        selectorView: function (view) {
            var self = this, $view;
            $view = self.$view.hide().filter("[data-view='" + view + "']").show();

            if (!$view.find("li.checked").size()) {
                $view.children(":first").addClass("checked");
            }
            self.launchView($view.find("li.checked"));
        },

        launchView: function ($li) {
            var self = this, catalogCode = $li.attr("data-id") || "",
                txt = $li.attr("data-text");

            $li.addClass("checked").siblings().removeClass("checked");
            self.callBackFn({
                id: catalogCode,
                name: self.opts.nodes.catalog,
                text: txt,
                keys: {
                    "BrandCode": self.tabId,
                    "CatalogCode": catalogCode
                }
            });

            if (!self.navData[self.tabId]) self.navData[self.tabId] = {};
            self.navData[self.tabId]["CatalogCode"] = catalogCode;

            self.loadYearAndModel(catalogCode);
        },

        loadYearAndModel: function (catalogCode) {
            var self = this,
                 params = {
                     CatalogCode: catalogCode
                 };
            ajax.invoke({
                url: self.getYearAndModelUrl,
                type: "GET",
                data: params,
                contentType: "application/json",
                beforeSend: function () {
                    self.$yearWrap.loadingShow();
                    self.$modelWrap.loadingShow();
                },
                complete: function () {
                    self.$yearWrap.loadingHide();
                    self.$modelWrap.loadingHide();
                },
                success: function (root) {
                    self.render(root.Data);
                },
                failed: function (root) {
                    alert(root.reason);
                }
            });
        },

        render: function (data) {
            var self = this,
                urlParams = self.oneParams,
                outputYear = Mustache.render(self.yearTemplate, { Years: data.Years || [] }), $li, ycode;

            self.$year.html(outputYear).show();

            if (urlParams && urlParams["Year"]) {
                $li = self.$year.find("li[data-id='" + urlParams["Year"] + "']");
                self.navData[self.tabId]["Year"] = urlParams["Year"];
            } else if (self.navData[self.tabId]["Year"]) {
                $li = self.$year.find("li[data-id='" + self.navData[self.tabId]["Year"] + "']");
            } else {
                $li = self.$year.children(":first");
            }

            ycode = $li.addClass("checked").attr("data-id");
            var txt = $li.attr("data-text");

            self.dataModels = data.Models;
            self.loadModel(ycode, txt);
        },

        loadModel: function (ycode, ytext) {
            var self = this,
                urlParams = self.oneParams,
                keyY = ycode ? ycode : "AllYear",
                ret = [], $li;
            $.each(self.dataModels, function (key, val) {
                if (key == ycode) {
                    ret = val;
                }
            });

            var outputModel = Mustache.render(self.modelTemplate, { Models: ret });

            self.$model.html(outputModel).show();

            if (!self.navData[self.tabId]["Year-Model"]) {
                self.navData[self.tabId]["Year-Model"] = {};
            }

            if (urlParams && urlParams["ModelCode"]) {
                $li = self.$model.find("li[data-id='" + urlParams["ModelCode"] + "']");
                self.navData[self.tabId]["Year-Model"][keyY] = urlParams["ModelCode"];
            }
            else if (self.navData[self.tabId]["Year-Model"][keyY]) {
                $li = self.$model.find("li[data-id='" + self.navData[self.tabId]["Year-Model"][keyY] + "']");
            }
            else {
                $li = self.$model.children(":first");
            }
            $li.addClass("checked");

            self.callBackFn({
                id: ycode,
                name: self.opts.nodes.year,
                text: ytext,
                keys: {
                    "BrandCode": self.tabId,
                    "CatalogCode": self.navData[self.tabId]["CatalogCode"],
                    "Year": ycode
                }
            });

            self.callBackFn({
                id: $li.attr("data-id"),
                name: self.opts.nodes.model,
                text: $li.attr("data-text"),
                keys: {
                    "BrandCode": self.tabId,
                    "CatalogCode": self.navData[self.tabId]["CatalogCode"],
                    "Year": ycode,
                    "ModelCode": $li.attr("data-id")
                }
            });
            self.oneParams && delete self.oneParams;

        }
    }

    return CataLogMain;

})
