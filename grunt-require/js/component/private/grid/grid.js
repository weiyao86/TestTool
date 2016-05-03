define(["ajax",
        "mustache",
        "globalConfig",
        "json2",
        "linq",
        "jqExtend",
        "jqueryUI",
        "jqueryDatepickeri18n",
        "blockUI",
        "moment"],
        function (ajax, Mustache, globalConfig) {

            var readUrl = globalConfig.actions.readUrl,
            	hostUrl = globalConfig.context.host,
                trans = globalConfig.trans;

            var defaultOpts = {
                filter: {
                    id: "filter",
                    resetId: "btn-reset",
                    filterId: "btn-filter",
                    extraCondition: []
                },
                grid: {
                    gridId: "grid",
                    fixedId: "fixed",
                    isRecursiveTitle: true,
                    selectedTrBg: "grid-selected-tr",
                    hoverTrBg: "grid-hover-tr",
                    blockTarget: "gridBlock",
                    keys: ["id"],
                    params: {},
                    sort: []
                },
                paging: {
                    id: "paging",
                    pageSize: 10,
                    gotoPageId: "btnGoTo",
                    topPageId: "btnTopPage",
                    prevPageId: "btnPrevPage",
                    nextPageId: "btnNextPage",
                    bottomPageId: "btnBottomPage",
                    pageCountId: "spPageCount",
                    recordCountId: "spRecordCount",
                    currentPageId: "tbCurrentPageIndex"
                },
                ajax: {
                    type: "POST",
                    contentType: "application/json"
                },
                callbacks: {
                    onRowClicked: null,
                    onCleared: null,
                    onLoadDataBefore: null,
                    onSearchBefore: null,
                    onLoadDataAfter: null
                }
            };

            var Grid = function (options) {
                this.opts = $.extend(true, {}, defaultOpts, options || {});

                this.currentIndex = 1;
                this.pageSize = this.opts.paging.pageSize;

                this.init();
            };

            Grid.prototype = {

                init: function () {
                    var self = this;

                    self.buildDomEls();
                    self.buildCss();
                    self.buildTemplate();
                    self.buildUrl();
                    self.bindEvent();
                },

                buildDomEls: function () {
                    var self = this,
                        grid = self.opts.grid,
                        paging = self.opts.paging,
                        filter = self.opts.filter;


                    self.$grid = $("#" + grid.gridId);
                    self.$fixed = $("#" + grid.fixedId);
                    self.$blockTarget = $("#" + grid.blockTarget);

                    self.$filter = $("#" + filter.id);
                    self.$btnFilter = $("#" + filter.filterId);
                    self.$btnReset = $("#" + filter.resetId);

                    self.$paging = $("#" + paging.id);
                    self.$pageCount = self.$paging.find("[data-id='" + paging.pageCountId + "']");
                    self.$recordCount = self.$paging.find("[data-id='" + paging.recordCountId + "']");
                    self.$currentPage = self.$paging.find("[data-id='" + paging.currentPageId + "']");
                    self.$topPage = self.$paging.find("[data-id='" + paging.topPageId + "']");
                    self.$prevPage = self.$paging.find("[data-id='" + paging.prevPageId + "']");
                    self.$nextPage = self.$paging.find("[data-id='" + paging.nextPageId + "']");
                    self.$bottomPage = self.$paging.find("[data-id='" + paging.bottomPageId + "']");
                    self.$gotoPage = self.$paging.find("[data-id='" + paging.gotoPageId + "']");

                    self.cacheCondition = [];
                },

                buildCss: function () {
                    var self = this;
                    !$("#grid_css_id").size() && (function () {
                        var styleCss = ".grid-selected-tr{background-color:#d0cfcf;}" +
                                       ".grid-hover-tr{background-color:#d0cfcf;}";
                        $("head:first").append('<style id="grid_css_id" type="text/css"> ' + styleCss + ' </style>');
                    })();
                },

                buildTemplate: function () {
                    var self = this;

                    self.gridTemplate = self.$grid.find("script[type='text/template']").html();
                    self.fixedTemplate = self.$fixed.find("script[type='text/template']").html();
                },

                buildUrl: function () {
                    var self = this;

                    self.readUrl = self.$grid.attr("data-read-url");
                },

                bindEvent: function () {
                    var self = this;

                    self.bindFilterEvent();
                    self.bindGridEvent();
                    self.bindPagingEvent();
                },

                bindFilterEvent: function () {
                    var self = this,
                        $dateInput = self.$filter.find("input[data-dateformat]");

                    self.$btnFilter.on("click", function () {
                        self.filter();
                    });

                    self.$btnReset.on("click", function () {
                        self.clear();
                    });

                    self.$filter.on("keyup", "input[type='text'][data-field]", function (e) {
                        if (e.keyCode === 13) {
                            self.filter();
                        }
                    });

                    $dateInput.each(function (index, el) {
                        self.bindDetepicker(el);
                    });

                    $dateInput.on("blur", function () {
                        self.validDateFormat(this);
                    });
                },

                bindDetepicker: function (el) {
                    var self = this,
                        df = $(el).attr("data-dateformat");

                    $(el).datepicker({
                        dateFormat: df,
                        showOn: "button",
                        changeMonth: true,
                        buttonImage: hostUrl + "/style/images/datepicker_btn_img.png"
                    });
                },

                validDateFormat: function (el) {
                    var self = this,
                        val = $(el).val(),
                        df = $(el).attr("data-dateformat");

                    if (val.length > 0) {
                        if (!moment(val, ["YYYY-MM-DD"], true).isValid()) {
                            alert(trans['185'] + " YYYY-MM-DD");
                            $(el).focus();
                        }
                    }
                },

                bindGridEvent: function () {
                    var self = this, sender, action;

                    self.$fixed.on("click", "> tbody > tr", function (e) {
                        sender = e.target;
                        action = $(sender).attr("data-action");
                        self.rowClick(sender, e, action);
                        self.selectedTrBg($(this).index(), self.opts.grid.selectedTrBg);
                        e.stopPropagation();
                    });

                    self.$grid.on("click", "> tbody > tr", function (e) {
                        sender = e.target;
                        action = $(sender).attr("data-action");
                        self.rowClick(sender, e, action);
                        self.selectedTrBg($(this).index(), self.opts.grid.selectedTrBg);
                        e.stopPropagation();
                    });

                    self.$fixed.add(self.$grid).on("mouseenter mouseleave", ">tbody>tr", function (e) {
                        if (e.type === "mouseenter") {
                            self.selectedTrBg(this.sectionRowIndex, self.opts.grid.hoverTrBg);
                        }
                        if (e.type === "mouseleave") {
                            self.hoverTrBg(this.sectionRowIndex, self.opts.grid.hoverTrBg);
                        }
                    });
                },


                selectedTrBg: function (rowIndex, cls) {
                    var self = this;
                    self.$fixed.add(self.$grid).find(">tbody>tr:eq(" + rowIndex + ")").addClass(cls).siblings("." + cls).removeClass(cls);
                },

                hoverTrBg: function (rowIndex, cls) {
                    var self = this;
                    self.$fixed.add(self.$grid).find(">tbody>tr:eq(" + rowIndex + ")").removeClass(cls);
                },

                rowClick: function (sender, e, action) {
                    var self = this,
                        rowIndex = $(sender).closest("tr").index(),
                        keys = self.getRowKeys(rowIndex),
                        cells = keys ? self.getRowValues(keys, rowIndex) : {};

                    if (self.opts.callbacks.onRowClicked)
                        self.opts.callbacks.onRowClicked.apply(self, [e, cells, keys, action]);
                },

                getRowValues: function (params, rowIndex) {
                    var self = this,
                        rowValues, condition = [],
                        keys = JSON.parse($.escapeSpecialChars(params));

                    for (var key in keys) {
                        if ($.inArray(key, self.opts.grid.keys) > -1)
                            condition.push(" ($." + key + "=='" + keys[key] + "') ");
                    }

                    rowValues = Enumerable.From(self.data)
                                          .Where(condition.join("&&"))
                                          .Select(self.getDataKeys(self.data, rowIndex))
                                          .ToArray();

                    for (var i = 0, values; values = rowValues[i]; i++) {
                        for (var key in values) {
                            rowValues[i][key] = typeof values[key] !== "undefined" ? values[key] : "";
                        }
                    }

                    return rowValues[0] ? rowValues[0] : {};
                },

                getDataKeys: function (data, rowIndex) {
                    var self = this, keys = [];

                    if (data.length > 0) {
                        for (var key in data[rowIndex]) {
                            keys.push(key + ": $." + key);
                        }
                    }

                    return "{" + keys.join(",") + "}";
                },

                getRowKeys: function (rowIndex) {
                    var self = this,
                        keys = self.$grid.find("tbody > tr:eq(" + rowIndex + ")").attr("data-keys");

                    return keys;
                },

                bindPagingEvent: function () {
                    var self = this, action, $target;

                    self.$paging.on("click", "li[class*='-enabled'] > a", function (e) {
                        action = $(this).attr("data-action");
                        switch (action) {
                            case "top":
                                if (self.pageCount > 1)
                                    self.currentIndex = 1;
                                break;
                            case "prev":
                                if (self.currentIndex > 1)
                                    self.currentIndex--;
                                break;
                            case "next":
                                if (self.currentIndex < self.pageCount)
                                    self.currentIndex++;
                                break;
                            case "bottom":
                                if (self.pageCount > 1 && self.currentIndex != self.pageCount)
                                    self.currentIndex = self.pageCount;
                                break;
                            default:
                                break;
                        }
                        self.loadData();
                    });

                    self.$currentPage.on("keyup", function (e) {
                        if (e.keyCode === 13) self.gotoPage();
                    });

                    self.$gotoPage.on("click", function (e) {
                        self.gotoPage();
                    });
                },

                search: function (params) {
                    var self = this;

                    self.commonSearch(params);
                },

                filter: function (params) {
                    var self = this;
                    self.cacheCondition = self.getCondition();
                    self.commonSearch(params);
                },

                commonSearch: function (params) {
                    var self = this;
                    if (typeof self.opts.callbacks.onSearchBefore === "function") {
                        self.opts.callbacks.onSearchBefore.apply(self, []);
                    }

                    self.sort = [];
                    if (params) {

                        if (params.pageIdx) {
                            if (typeof params.pageIdx == "function") {
                                params.pageIdx.apply(self, [self]);
                            }
                            else{
                                self.currentIndex = params.pageIdx;
                            }
                        } else if (!params.isCurIdx) {
                            self.currentIndex = 1;
                        }
                    } else {
                        self.currentIndex = 1;
                    }
                    self.loadData();
                },

                loadData: function () {
                    var self = this, params,
                        ajaxConfig = self.opts.ajax,
                        callbacks = self.opts.callbacks,
                        params = self.getParams();

                    if (typeof callbacks.onLoadDataBefore === "function")
                        callbacks.onLoadDataBefore.apply(self, [params]);


                    self.xhr = ajax.invoke({
                        contentType: ajaxConfig.contentType,
                        type: ajaxConfig.type,
                        url: self.readUrl,
                        data: params,
                        success: $.proxy(self.buildData, self),
                        failed: $.proxy(self.failed, self),
                        beforeSend: function () { self.loadingShow(); },
                        complete: function () { self.loadingHide(); }
                    });
                },

                getParams: function () {
                    var self = this,
                        grid = self.opts.grid,
                        sort = self.opts.grid.sort;

                    if ($.isEmptyObject(grid.params)) {
                        return JSON.stringify({
                            pageCondition: {
                                Condition: {
                                    Sorting: sort,
                                    Filters: self.cacheCondition
                                },
                                PageFilter: {
                                    CurrentIndex: self.currentIndex || 1,
                                    PageSize: self.pageSize || 10
                                }
                            }
                        });
                    } else {
                        return grid.params;
                    }
                },

                buildData: function (root) {
                    var self = this, i, renderData,
                        pageSize = self.opts.paging.pageSize;
                    if (typeof self.opts.callbacks.onLoadDataAfter === "function")
                        self.opts.callbacks.onLoadDataAfter.apply(self, [root]);

                    self.data = root.Data.Details || [];
                    self.recordCount = root.Data.Total || 0;
                    self.pageCount = (self.recordCount % pageSize == 0) ? (parseInt(self.recordCount / pageSize)) : (parseInt(self.recordCount / pageSize) + 1);

                    for (i = 0; i < self.data.length; i++) {
                        self.data[i]["rowNumber"] = parseInt(self.currentIndex - 1) * parseInt(self.pageSize) + (i + 1);
                    }

                    renderData = self.buildGridData(self.data);

                    self.render(renderData);
                    self.pagingtionStatus();
                    self.loadingHide();
                    if (typeof self.opts.callbacks.onRenderAfter === "function")
                        self.opts.callbacks.onRenderAfter.apply(self, [root]);
                },

                failed: function (error) {
                    var self = this;

                    alert(error.reason);
                    self.loadingHide();
                },

                buildGridData: function (data) {
                    var self = this, i,
                        renderData = $.extend(data, {});

                    return renderData;
                },

                getCondition: function () {
                    var self = this,
                        field, value,
                        operator, condition = [], $el,
                        $item = self.$filter.find("[data-scope='filter']"),
                        extraCondition = self.opts.filter.extraCondition;

                    $(extraCondition).each(function (index, item) {
                        field = item.field;
                        value = item.value;
                        operator = item.operator || "5";
                        if ($.trim(value).length > 0)
                            condition.push({
                                Name: field,
                                Value: value,
                                Filter: operator
                            });
                    });

                    $item.each(function () {
                        $el = $(this)
                        field = $el.attr("data-field");
                        value = $el.hasClass("easyui-combobox") ? $el.combobox("getValue") : $el.getVal();
                        operator = ($el.attr("data-operator") || "5");
                        if ($.trim(value).length > 0)
                            condition.push({
                                Name: field,
                                Value: value,
                                Filter: operator
                            });
                    });

                    return condition;
                },

                clear: function () {
                    var self = this, $el,
                        selector = "[data-scope='filter'][data-isclear!='false']",
                        $clearItems = self.$filter.find(selector);

                    $clearItems.each(function () {
                        $el = $(this);
                        $el.hasClass("easyui-combobox") ? $el.combobox("setValue", "") : $el.clearVal();
                    });

                    if (typeof self.opts.callbacks.onCleared === "function") {
                        self.opts.callbacks.onCleared.apply(this, []);
                    }
                },

                pagingtionStatus: function () {
                    var self = this;

                    self.$pageCount.html(self.pageCount);
                    self.$recordCount.html(self.recordCount);
                    self.$currentPage.val(self.currentIndex);
                    self.pagingButttonStatus();
                },

                gotoPage: function () {
                    var self = this,
                        gotoPageIndex = self.$currentPage.val();

                    if (!/^[0-9]+$/.test(gotoPageIndex)) {
                        gotoPageIndex = 1;
                    }
                    if (parseInt(gotoPageIndex) > self.pageCount) {
                        self.currentIndex = 1;
                    } else {
                        self.currentIndex = parseInt(gotoPageIndex);
                    }

                    self.loadData();
                },

                pagingButttonStatus: function () {
                    var self = this;

                    self.$topPage.removeClass("paging-top-enabled").addClass("paging-top-disabled");
                    self.$prevPage.removeClass("paging-prev-enabled").addClass("paging-prev-disabled");
                    self.$nextPage.removeClass("paging-next-enabled").addClass("paging-next-disabled");
                    self.$bottomPage.removeClass("paging-bottom-enabled").addClass("paging-bottom-disabled");

                    if (self.currentIndex > 1 && self.currentIndex < self.pageCount) {
                        self.$topPage.addClass("paging-top-enabled");
                        self.$prevPage.addClass("paging-prev-enabled");
                        self.$nextPage.addClass("paging-next-enabled");
                        self.$bottomPage.addClass("paging-bottom-enabled");
                    }
                    else if (self.currentIndex === 1 && self.pageCount > 1) {
                        self.$nextPage.addClass("paging-next-enabled");
                        self.$bottomPage.addClass("paging-bottom-enabled");
                    } else if (self.pageCount === self.currentIndex && self.currentIndex > 1) {
                        self.$topPage.addClass("paging-top-enabled");
                        self.$prevPage.addClass("paging-prev-enabled");
                    }
                },

                render: function (data) {
                    var self = this, gridHtml, fixedHtml, $tdList,
                        $renderGrid = self.$grid.find("tbody"),
                        $renderFixed = self.$fixed.find("tbody");


                    gridHtml = Mustache.to_html(self.gridTemplate, { records: data });

                    $renderGrid.html(gridHtml).show();

                    if (self.fixedTemplate) {
                        fixedHtml = Mustache.to_html(self.fixedTemplate, { records: data });
                        $renderFixed.html(fixedHtml).show();
                    }

                    self.gridOddStyle();

                    $tdList = $renderFixed.size() ? $renderGrid.add($renderFixed).find("td,th") : $renderGrid.find("td,th");

                    self.recursionSetTitle($tdList);

                },

                recursionSetTitle: function ($td) {
                    var self = this, $val;
                    $td.each(function (index, val) {
                        $val = $(val);
                        if ($val.children().size()) {
                            if (self.opts.grid.isRecursiveTitle) {
                                var $trListChild = $val.children();
                                $trListChild.size() && self.recursionSetTitle($trListChild);
                            }
                        } else
                            $val.attr("title", $val.html());
                    });
                },

                gridOddStyle: function () {
                    var self = this,
                        $gridBody = self.$grid.find("tbody"),
                        $fixedGridBody = self.$fixed.find("tbody");

                    $gridBody.find("tr:odd").addClass("odd");
                    $fixedGridBody.find("tr:odd").addClass("odd");
                },

                loadingShow: function () {
                    var self = this,
                        dialogWidth = 80,
                        dialogHeight = 30;

                    if (self.$blockTarget.size()) {
                        self.$blockTarget.block({
                            message: "<img src='" + hostUrl + "/style/images/loading.gif' />",
                            css: {
                                left: (self.$blockTarget.width() - dialogWidth) / 2 + "px",
                                top: (self.$blockTarget.height() - dialogHeight) / 2 + "px",
                                width: 80,
                                border: "none",
                                background: "none"
                            }
                        });
                    } else {
                        $.blockUI({
                            message: "<img src='" + hostUrl + "/style/images/loading.gif' />",
                            css: {
                                left: ($(window).width() - dialogWidth) / 2 + "px",
                                top: ($(window).height() - dialogHeight) / 2 + "px",
                                width: 80,
                                border: "none",
                                background: "none"
                            }
                        });
                    }

                },

                loadingHide: function () {
                    var self = this;
                    if (self.$blockTarget.size()) {
                        self.$blockTarget.unblock();
                    }
                    else {
                        $.unblockUI();
                    }
                }
            };

            return Grid;
        });
