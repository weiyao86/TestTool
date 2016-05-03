define(["globalConfig",
    "ajax",
    "mustache",
    "shoppingCart",
    "note",
    "hotpoint",
    "loading",
    "track",
    _globalHasLtIE9 ? "zeroClipboard" : undefined,
    "jqExtend", "layResizable", "amplify", "swfobject", "blockUI", "scrollIntoView"],
    function (globalConfig, ajax, Mustache, ShoppingCart, Note, Hotpoint, Loading, track, ZeroClipboard) {

        var printUrl = globalConfig.actions.print,
            shoppingCartSave = globalConfig.actions.shoppingCartSave,
            historyInsertUrl = globalConfig.actions.historyInsertUrl,
            getUsageUrl = globalConfig.actions.usage,

            trans = globalConfig.trans,
            host = globalConfig.context.host;

        var defaultOpts = {
            contentWrapId: "legend_container",
            usage: "usage",
            usageTemplateId: "usage-template",
            legend: "legend-wrap",
            legendHead: "legend-head",
            legendBody: "legend-body",
            parts: "parts-wrap",
            partsHead: "parts-head",
            partsBody: "parts",
            partList: "part-list",
            arrowR: "arrow_r",
            gpContainer: "group_container",
            ldContainer: "legend_container",
            imgWrap: "img_gp",
            imgGpTemplate: "img_gp_template",

            callbacks: {
                onClickArrow: null,
                onToolbarClick: null,
                afterImgClick: null,
                afterShowLegend: null,
                onLeaveLegend: null
            }
        };

        var Usage = function (options) {
            this.opts = $.extend({}, defaultOpts, options || {});

            this.init();
        };

        Usage.prototype = {

            init: function () {
                var self = this;

                self.bindDomEls();
                self.extend();

                self.initComponent();
                self.bindEvent();
                self.buildTemplate();

            },

            extend: function () {
                var self = this;
                Loading.extend([self, self.$parts, self.$legend, self.$gpContainer]);
            },

            bindDomEls: function () {
                var self = this;

                self.$contentWrap = $("#" + self.opts.contentWrapId);
                self.$usageTemplate = $("#" + self.opts.usageTemplateId);
                self.$partsUse = self.$contentWrap.find("[data-ModelNote]");
                self.$partList = $("#" + self.opts.partList);
                self.$parts = $("#" + self.opts.parts);
                self.$arrowR = $("#" + self.opts.arrowR);
                self.$imgWrap = $("#" + self.opts.imgWrap);
                self.imgTemplate = $("#" + self.opts.imgGpTemplate).html();
                self.$gpContainer = $("#" + self.opts.gpContainer);
                self.$ldContainer = $("#" + self.opts.ldContainer);
                self.treeW = self.treeTempW = self.$parts.width();

                
                self.buildUsageDomEls();
            },

            buildTemplate: function () {
                var self = this;

                self.usageTemplate = self.$usageTemplate.html();
            },

            bindEvent: function () {
                var self = this, w = 0;

                $(window).resize(self.debounce(function () {
                    self.resize()
                }));

                self.$contentWrap.on("click", "tr[data-callout]", function (e) {
                    var $target = $(e.target), callout,
                        action = $target.attr("data-action"),
                        partNumber = $(this).attr("data-partNum");

                    switch (action) {
                        case "buy":
                            self.addtoShoppingCart(partNumber);
                            track.publish("legendData", "右数据-购买", "click", "add", "PartNumber:" + partNumber);
                            break;
                        case "supersession":
                            self.showSuperSession(partNumber);
                            track.publish("legendData", "右数据-替换", "click", "view", "PartNumber:" + partNumber);
                            break;
                        case "link-detail":
                            track.publish("legendData", "右数据-详情", "click", "link", "PartNumber:" + partNumber);
                            break;
                        case "note-link-detail":
                            track.publish("legendData", "右数据-备注", "click", "link", "PartNumber:" + partNumber);
                            break;
                        case "copy":
                            self.setCoptyForLteIE9($target);
                            track.publish("legendData", "右数据-复制", "click", "copy", "PartNumber:" + partNumber);
                            break;
                        default:
                            callout = parseInt($(this).attr("data-callout"));
                            self.linkParts([callout], "row");
                            break;
                    }
                    e.stopPropagation();
                });

                self.$contentWrap.on("mouseover", "[data-ModelNote]", function (e) {
                    self.note.delayShow(e, $(this), self.$contentWrap.height());
                });

                self.$contentWrap.on("mouseout", "[data-ModelNote]", function (e) {
                    self.note.delayHide();
                });

                self.$arrowR.on("click", function () {
                    var $this = $(this), action;
                    if (self.treeW) {
                        w = -self.treeW;
                        self.treeW = 0;
                        action = "collapse";
                    } else {
                        w = 0;
                        self.treeW = self.treeTempW;
                        action = "expand";
                    }
                    self.$parts.animate({ "marginRight": w }, function () {
                        self.resize();
                        if (typeof self.opts.callbacks.onClickArrow === "function") {
                            self.opts.callbacks.onClickArrow.call(self, this);
                        }
                        $this.toggleClass("pos-to-l");
                        track.publish("legendData", "侧边栏右-" + (action == "collapse" ? "收缩" : "展开"), "click", action);
                    });

                });

                self.$imgWrap.on("click", "li", function () {
                    var $this = $(this),
                        code = $this.attr("data-code");

                    self.opts.urlParams = $.extend({}, self.opts.urlParams, {
                        "GroupCode": $this.attr("data-group"),
                        "ImageCode": code
                    });

                    if (typeof self.opts.callbacks.afterImgClick === "function") {
                        self.opts.callbacks.afterImgClick.call(null, { imgId: code });
                    }

                    track.publish("thumbnails", "缩略图例", "click", "view", JSON.stringify(self.opts.urlParams));
                });

                self.$legend.on("contextmenu", function () {
                    return false;
                });

                //show number
                $.moveTips(self.$partList, "[data-action='move-tip']", $("#move_tip"), {
                    callback: {
                        afterStopMove: function ($target) {
                            var name = $target.attr("data-move-name"),
                                partNo = $target.attr("data-id");
                            switch (name) {
                                case "price":
                                    track.publish("legendData", "右数据-价格", "click", "mouseenter", "PartNumber:" + partNo);
                                    break;
                                case "cart-num":
                                    track.publish("legendData", "右数据-购物车", "click", "mouseenter", "PartNumber:" + partNo);
                                    break;
                                default:
                            }
                        }
                    }
                });

            },

            debounce: function (func, wait, immediate) {
                var timeout;
                return function () {
                    var context = this, args = arguments;
                    var later = function () {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            },

            initComponent: function () {
                var self = this;

                self.note = new Note();

                self.initGifHotpoint();

                ZeroClipboard && ZeroClipboard.config({
                    swfPath: globalConfig.pluginPath.zeroClipboardSwf,
                    trustedDomains: ['*']
                });
            },

            initImgList: function (params, data) {
                var self = this;
                self.opts.urlParams = params;
                self.$gpContainer.is(":hidden") && self.$gpContainer.show();
                self.renderImgList(data);
                self.intoLegend(false);
            },

            intoLegend: function (flag) {
                var self = this;
                if (flag) {
                    if ($.type(self.opts.callbacks.afterShowLegend) === "function") {
                        self.opts.callbacks.afterShowLegend.call(null, self.opts.urlParams);
                    }
                } else {
                    if ($.type(self.opts.callbacks.onLeaveLegend) === "function") {
                        self.opts.callbacks.onLeaveLegend.call(null);
                    }
                }
            },

            renderImgList: function (data) {
                var self = this,
                    outHtml = Mustache.render(self.imgTemplate, { ImageList: data || [] });

                self.$imgWrap.html(outHtml);
                self.$imgWrap.find("img[data-action='loaded']").adaptive({
                    isAdaptive: false,
                    callback: {
                        error: function (that) {
                            that.attr("src", globalConfig.pathsImg.defaultImg);
                        }
                    }
                });
            },
            /*
            */

            initGifHotpoint: function () {
                var self = this;

                self.hotpoint = new Hotpoint({
                    radius: 10,
                    dock: "TL",
                    radius: 10,
                    assistiveTool: "3",
                    tbodyId: "part-list",
                    renderToId: "legend-wrap",
                    selectedRowBgClass: "selection-part",
                    nopic: globalConfig.pathsImg.defaultImg,
                    externalConfig: globalConfig,
                    legendLoadingImg: globalConfig.context.host + '/style/images/loading.gif',
                    grabSrc: globalConfig.context.host + '/style/images/grab.cur',
                    grabbingSrc: globalConfig.context.host + '/style/images/grabbing.cur',
                    callbacks: {
                        onPrint: function () { self.printUsage(); },
                        onToolClick: function (action) {
                            var st = "";
                            if (action == "prev" || action == "next") {
                                self.opts.callbacks.onToolbarClick.apply(self, [action]);
                            }
                            switch (action) {
                                case "prev":
                                    st = "上一张";
                                    break;
                                case "next":
                                    st = "下一张";
                                    break;
                                case "zoomin":
                                    st = "放大";
                                    break;
                                case "zoomout":
                                    st = "缩小";
                                    break;
                                case "reset":
                                    st = "还原";
                                    break;
                                case "print":
                                    st = "打印";
                                    break;
                                default:
                                    break;
                            };
                            st && track.publish("legendData", "热点图-" + st, "click", "view", st);

                        },
                        onSelectionCallout: function (callouts) {
                            self.linkParts(callouts, "img");
                        },
                        onLegendDbClick: function () {
                            if (this.opts.legendExist) {
                                this.resetLegend();
                                this.redraw();
                            }
                        }
                    }
                });
            },

            linkParts: function (callouts, flag) {
                var self = this,
                    selector = self.getCalloutSelector(callouts),
                    $rows = self.$partList.find(selector),
                    remark = [];

                remark = $.map($rows, function (val, idx) {
                    return $(val).attr("data-partNum");
                });

                if (self.oldRow) {
                    self.oldRow.removeClass("selection-part selection-important");
                }
                if (flag == "row") {
                    track.publish("legendData", "右数据-行选中热点", "click", "view", "PartNumber:" + remark.join(','));
                } else if (flag === "img") {
                    track.publish("legendData", "右数据-图选中热点", "click", "view", "PartNumber:" + remark.join(','));
                }
                self.oldRow = $rows.addClass("selection-part");
                $rows.size() && self.scrollIntoView($rows);

                self.tempPartNumber && $rows.filter("[data-partNum='" + self.tempPartNumber + "']").addClass("selection-important");

            },

            getCalloutSelector: function (callouts) {
                var self = this, selector = [];

                for (var i = 0; i < callouts.length; i++) {
                    selector.push("tr[data-callout='" + callouts[i] + "']");
                }

                return selector.join(",");
            },

            scrollIntoView: function ($rows) {
                var self = this;

                $rows.scrollIntoView();
               
            },

            /*
            **
            */

            addtoShoppingCart: function (partNumber) {
                var self = this;
                self.rowPartNum = partNumber;
                amplify.publish("buy", partNumber);
            },

            sltRowByPartNum: function (flag, partNum, partQty) {
                var self = this;
                self.rowPartNum = partNum;
                self.toggleShopIcon(flag, partQty);
            },

            toggleShopIcon: function (flag, partQty) {
                var self = this,
                    $shopS = self.$partList
                    .find("tr[data-partNum='" + self.rowPartNum + "']")
                    .find("[data-field='shop_num']"),
                    cls = "shopcart-num-active",
                    rvCls = "shopcart-num";

                if (flag) {
                    $shopS.attr({
                        "data-action": "move-tip",
                        "data-content": trans['11134'] + partQty
                    }).removeClass().addClass(cls);
                } else {
                    $shopS.removeAttr("data-action").removeAttr("data-content").removeClass().addClass(rvCls);
                }
            },

            showSuperSession: function (partNumber) {
                var params = { "PartNumber": partNumber };

                amplify.publish("go-to-supersession", params);
            },

            printUsage: function () {
                var self = this,
                    params = self.getParams();

                window.open(printUrl + "&" + params, "_blank");
            },

            getParams: function () {
                var self = this,
                    items = [],
                    params = self.opts.urlParams;

                for (var key in params) {
                    items.push(key + "=" + params[key]);
                }

                return items.join("&");
            },

            show: function (params) {
                var self = this;
                self.$gpContainer.hide();
                self.$ldContainer.show();

                self.opts.urlParams = $.extend({}, self.opts.urlParams, params);

                self.tempPartNumber = self.opts.urlParams.PartNumber;
                self.loadUsage();

                //show favoitesBtn
                self.intoLegend(true);

            },

            loadUsage: function () {
                var self = this, data;

                ajax.invoke({
                    url: getUsageUrl,
                    data: self.opts.urlParams,
                    type: "GET",
                    cache: false,
                    success: function (root) {
                        self.finishUsageLoaded(root.Data || {});
                    },
                    failed: function (root) {
                        alert(root.reason);
                    },
                    beforeSend: function () {
                        self.$parts.loadingShow();
                        self.$legend.loadingShow();
                    },
                    complete: function () {
                        self.$parts.loadingHide();
                    }
                });
            },

            finishUsageLoaded: function (data) {
                var self = this;

                self.loadLegend(data);
                self.renderPartList(data);
            },

            renderPartList: function (data) {
                var self = this,
                    template = self.usageTemplate,
                    callouts = self.getCallouts(data.parts),
                    output = Mustache.render(template, data);

                self.$partList.html(output);
                self.linkParts(callouts);
                self.setCopyText();
                $.isExistScroll(self.$partsBody, self.$partsHead);
            },

            loadLegend: function (data) {
                var self = this,
                    legend = data.legend,
                    gifPath = globalConfig.paths.legend + legend.filename;

                self.hotpoint.bindLegend({
                    src: gifPath,
                    data: data.Hotpoint,
                    legendExist: true,
                    swfLegendWidth: legend.width,
                    swfLegendHeight: legend.height
                }, function () {
                    var callouts = self.getCallouts(data.parts);
                    callouts.length && self.hotpoint.linkHotpoint(callouts);
                });
            },

            getCallouts: function (parts) {
                var self = this,
                    partNumber = self.opts.urlParams.PartNumber,
                    callout, callouts = [];

                for (var i = 0; i < parts.length; i++) {
                    callout = parts[i].Callout;

                    if (parts[i].PartNumber === partNumber
                        && $.inArray(callout, callouts) === -1) {
                        callouts.push(callout);
                    }
                }

                return callouts;
            },

            buildUsageDomEls: function () {
                var self = this;

                self.$usage = $("#" + self.opts.usage);
                self.$parts = $("#" + self.opts.parts);
                self.$partsHead = $("#" + self.opts.partsHead);
                self.$partsBody = $("#" + self.opts.partsBody);
                self.$legend = $("#" + self.opts.legend);
                self.$legendBody = $("#" + self.opts.legendBody);
            },

            setCoptyForLteIE9: function ($target) {
                var self = this,
                    clipboard = window.clipboardData, clipText, c;

                if (!ZeroClipboard) {
                    if ($target) {
                        clipText = $target.attr("data-clipboard-text");
                        clipboard.clearData("Text");
                        c = clipboard.setData('Text', clipText);
                        if (c) {
                            alert(trans["11141"] +":"+ clipText + "\r\n" + trans["11142"]);
                        }
                        else {
                            alert(trans["11143"]);
                        }
                    }
                }
            },

            setCopyText: function () {
                var self = this, $copyList;
                if (ZeroClipboard) {
                    $copyList = self.$contentWrap.find("a[data-action='copy']");
                    ZeroClipboard.off();
                    new ZeroClipboard($copyList);
                    ZeroClipboard.on("aftercopy", function (e) {
                        alert(trans["11141"] + ":" + $(e.target).attr("data-clipboard-text") + "\r\n" + trans["11142"]);
                    });
                }
            },


            resize: function () {
                var self = this;
                if (self.hotpoint) {
                    self.$usage.is(":visible") && self.hotpoint.resizeToAdjust();
                }
            }
        };

        return Usage;
    })