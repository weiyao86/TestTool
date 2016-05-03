define(["globalConfig", "ajax", "track", "jqExtend"], function (globalConfig, ajax, track) {

    var defaults = {
        bookmarkSaveUrl: globalConfig.actions.bookmarkSaveUrl,
        callbacks: {
            onClickNode: null,
            onClickVin: null
        }
    };

    var Crumbs = function (opts) {
        this.opts = $.extend({}, defaults, opts);
        this.init();
    };

    Crumbs.prototype = {

        init: function () {
            var self = this;
            self.buildDom();
            self.bindEvent();
            self.initNavUrl();

            self.initPlaceholder();
        },

        buildDom: function () {
            var self = this;
            self.$crumbsPanel = $("#crumbs-wrap");
            self.$navSearchBar = $("#nav-search-bar");
            self.$btnBookmark = $("#btn-add-bookmark");
            self.$bookmark = $("#bookmark");
            self.$desc = self.$bookmark.find("[data-action='desc']");
        },

        bindEvent: function () {
            var self = this;
            self.$btnBookmark.click(function () {
                if (typeof self.opts.callbacks.onAddFavorites === "function") {
                    self.opts.callbacks.onAddFavorites.apply(self, [self.params]);
                }
            });

            self.$bookmark.on("click", "[data-action]", function (e) {
                var action = $(e.target).attr("data-action");

                switch (action) {
                    case "save":
                        self.requestBookmark();
                        break;
                    case "close":
                        self.close();
                        break;
                    default:
                        break;
                }
            });

            self.$crumbsPanel.on("click", "a[data-id]", function () {
                var url = $(this).attr("href"),
                    cagName = $(this).attr('data-desc'),
                    $sp = $(this).find("[data-name]"),
                    desc = $sp.html(),
                    code = $sp.attr("data-name");

                track.publish("header", "面包屑导航-" + cagName, "click", "view", url);
            });

            self.$navSearchBar.on("click keyup", "li [data-field]", function (e) {
                var $this = $(this),
                    field = $this.attr("data-field"),
                    input;

                if (field === "general-btn" && e.type == "click") {
                    input = $this.siblings("input").val();
                    self.searchCommon(input);
                }
                else if (field === "general" && e.type == "keyup") {
                    if (e.keyCode == 13) {
                        input = $this.val();
                        self.searchCommon(input, $this);
                    }
                }

            });
        },

        initPlaceholder: function () {
            var self = this;
            self.$navSearchBar.find("li [data-field='general']").initPlaceholder({
                lfdistance: 30
            });
        },

        interfaceSearch: function (input) {
            var self = this;
            track.publish("header", "外链传入参数(VIN码,VSN码,零件编号或零件描述)查询", "click", "view", input);
            self.$navSearchBar.find("li [data-field='general']").val(input);
            self.searchCommon(input);
            
        },

        searchCommon: function (input, $target) {
            var self = this,
                targetName = "请输入VIN码,VSN码,零件编号或零件描述",
                validTxt = $.trim(input),
                param;
            if (!validTxt) return;
            $target && $target.blur();

            //包含lzw,不包含中文就查询vin

            if (/^.*lzw.*$/i.test(validTxt) && !/[\u4e00-\u9fa5]+/.test(validTxt)) {
                if ($.type(self.opts.callbacks.onClickVin) === "function") {
                    self.opts.callbacks.onClickVin.apply(null, [input]);
                }
                param = { Vin: input };
            } else if (/^[A-Za-z0-9]{14}$/.test(validTxt)) {
                //14 and 字母+数字查询vsn
                if ($.type(self.opts.callbacks.onClickVsn) === "function") {
                    self.opts.callbacks.onClickVsn.apply(null, [input]);
                }
                param = { Vsn: input };
            } else if (/^(\w|-|\+|\/)+$/ig.test(validTxt) || globalConfig.context.lang.indexOf("en_US") > -1) {
                //字母+数字 or 包含-+/查询零件号
                if ($.type(self.opts.callbacks.onClickPartNumber) === "function") {
                    self.opts.callbacks.onClickPartNumber.apply(null, [input]);
                }
                param = { PartNumber: input };
            } else {
                if ($.type(self.opts.callbacks.onClickPartDesc) === "function") {
                    self.opts.callbacks.onClickPartDesc.apply(null, [input]);
                }
                param = { PartDesc: input };
            }

            track.publish("header", targetName, "click", "view", param);
        },

        initNavUrl: function () {
            var self = this, $a, $this, host, url = '';
            self.$crumbsPanel.find("[data-name]").each(function (idx, val) {
                $this = $(val);
                $a = $this.closest("a");
                var href = $a.attr("href"),
                    node = $this.attr("data-name"),
                    code = $this.attr("data-code");
                if (!host) host = href;
                switch ($.trim(node)) {
                    case "brand":
                        var symbol = "?";
                        if (host.indexOf('?') > -1) { symbol = "&"; }
                        url += (symbol + "BrandCode=" + code);
                        break;
                    case "catalog":
                        url += "&CatalogCode=" + code;
                        break;
                    case "year":
                        url += "&Year=" + code;
                        break;
                    case "model":
                        url += "&ModelCode=" + code;
                        break;
                    default:
                        break;
                }

                $a.attr("href", host + url);
            });
        },

        showBtnBookmark: function (params) {
            var self = this;

            self.params = params;
            self.$btnBookmark.show();
        },

        hideBtnBookmark: function () {
            var self = this;

            self.$btnBookmark.hide();
        },


        requestBookmark: function () {
            var self = this,
                params = self.params,
                desc = self.$desc.val();

            if (desc.length === 0) {
                alert(trans["245"]);
                return;
            };
            params["Description"] = desc;

            ajax.invoke({
                url: self.opts.bookmarkSaveUrl,
                data: JSON.stringify(params),
                contentType: "application/json",
                success: function (root) {
                    alert(trans["162"]);
                    self.close();
                    self.$desc.val("");
                },
                failed: function (root) {
                    alert(root.reason);
                }
            });
        },

        close: function () {
            $.unblockUI();
        },

        setNodeText: function (params) {
            var self = this, href, $a;
            if ($.isEmptyObject(params)) return;

            $a = self.$crumbsPanel.find("[data-name='" + (params.name || "") + "']")
                .attr("data-code", params.id)
                .html(params.text)
                .closest("a");
            href = $a.attr("href");
            if (params.keys) {
                for (var item in params.keys) {
                    href = $.redirectLink(href, params.keys[item], item, 'no');
                }
            }
            $a.attr({
                "href": href,
                "data-id": params.id,
                "title": params.text
            });
        }

    };

    return Crumbs;
});