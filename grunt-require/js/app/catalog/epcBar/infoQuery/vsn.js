
define(["globalConfig", "ajax", "grid", "mustache", "loading", "track", "blockUI"], function (globalConfig, ajax, Grid, Mustache, Loading, track) {

    var vsnSearchUrl = globalConfig.actions.vsnSearch;

    var defaultOpts = {
        callbacks: {
            onSearch: null,
            onCatalogGoTo: null
        }
    },
     trans = globalConfig.trans;

    var VsnSearch = function (options) {

        this.opts = $.extend({}, defaultOpts, options || {});
        this.init();

    };

    VsnSearch.prototype = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.extend();
            self.bindTemplate();
            self.bindEvent();
        },

        bindDomEls: function () {
            var self = this;

            self.$vsn = $("#vsn-search");
            self.$filter = $("#vsn-filter");
            self.$vsnCondition = self.$filter.find("[data-field='vsn']")
            self.$vsnInfo = $("#vsn-info");
            self.$vsnVarieties = $("#vsn-varieties");
            self.$selectDialog = $("#vsn-select-dialog");
            self.$selectWrap = $("#vsn-select-wrap");
            self.$block = $("#vsn-block-scope");
        },

        extend: function () {
            var self = this;
            Loading.extend([self.$block]);
        },

        bindTemplate: function () {
            var self = this;

            self.template = self.$vsnInfo.find("script").html();
            self.vsnVarieties = self.$vsnVarieties.find("script").html();
            self.selectTemplate = self.$selectWrap.find("script").html();
        },

        bindEvent: function () {
            var self = this, scope;

            self.$selectDialog.on("click", "[data-action='select']", function (e) {
                self.choiceData($(e.target).attr("data-id"));
                self.close(self.opts.infoQueryWrap);
            });

            self.$vsn.on("click", "[data-scope]", function (e) {
                scope = $(e.target).attr("data-scope");

                switch (scope) {
                    case "filter":
                        self.filterValidate();
                        break;
                    case "filter-model":
                        if (self.data) self.searchGoTo();
                        break;
                    case "filter-info":
                        if (self.data) self.catalogGoTo();
                        break;
                    default:
                        break;
                }
            });

            self.$filter.on("keyup", "input[type='text'][data-field]", function (e) {
                if (e.keyCode === 13) self.filterValidate();
            });
        },

        filterValidate: function () {
            var self = this,
                params = { "Vsn": self.$vsnCondition.val() };

            if ($.trim(params.Vsn).length !== 0) {
                self.load(params);
            } else {
                alert(trans["10002"]);
                self.$vsnCondition.focus();
            }
            track.publish("vsn", "查询", "click", "view", params);
        },

        load: function (params) {
            var self = this;

            ajax.invoke({
                url: vsnSearchUrl,
                contentType: "application/json",
                data: JSON.stringify(params),
                beforeSend: function () {
                    self.$block.loadingShow();
                },
                complete: function () {
                    self.$block.loadingHide();
                },
                success: function (root) {
                    self.data = root.Data;
                    self.decision(root.Data);
                },
                failed: function (root) {
                    alert(root.reason);
                }
            });
        },

        decision: function (data) {
            var self = this,
                $toolbar = self.$vsn.find("[data-toolbar='tool']");

            for (var i = 0, item; item = data.Varieties[i]; i++) {
                data.Varieties[i]['Year'] = data.Year;
            }

            $toolbar.show();

            self.render(data);

            if (data.Mulitiple) {
                self.renderDialogData(data);
                self.open();
            } else {
                self.renderSelectionData(data.Varieties);
            }
            if (!data.HasValue) {
                $toolbar.hide();
                alert(trans["11126"]);
            }
        },

        render: function (data) {
            var self = this,
                vsnInfoHtml = Mustache.render(self.template, { records: data });

            self.$vsnInfo.html(vsnInfoHtml);
        },

        renderSelectionData: function (data) {
            var self = this,
                varietiesHtml = Mustache.render(self.vsnVarieties, { records: data });

            self.$vsnVarieties.html(varietiesHtml);
        },

        renderDialogData: function (data) {
            var self = this,
                html = Mustache.render(self.selectTemplate, { records: data.Varieties });

            self.$selectWrap.html(html);
        },

        choiceData: function (code) {
            var self = this,
                data = self.data.Varieties;

            for (var i = 0; i < data.length; i++) {
                if (data[i].Id === Number(code)) {
                    self.renderSelectionData(data[i]);
                }
            }
        },

        searchGoTo: function () {
            var self = this,
                onSearch = self.opts.callbacks.onSearch,
                params = self.getParams();

            if (typeof onSearch === 'function') onSearch.apply(null, [params]);
        },

        catalogGoTo: function () {
            var self = this,
                nodes = self.getCatalogNodes(),
                onCatalogGoTo = self.opts.callbacks.onCatalogGoTo;

            if (typeof onCatalogGoTo === "function") {
                onCatalogGoTo.apply(null, [nodes]);
            }
        },

        getParams: function () {
            var self = this,
                params = {}, type, code,
                $items = $("#nodes-wrap").find("li");

            $items.each(function (index, el) {
                type = $(el).attr("data-type");
                code = $(el).attr("data-code");
                params[type] = code;
            });

            return params;
        },

        getCatalogNodes: function () {
            var self = this,
                nodes = [],
                $items = $("#nodes-wrap").find("li"),
                parmes;

            $items.each(function (index, el) {
                $el = $(el);
                parmes = {
                    type: $el.attr("data-type"),
                    code: $el.attr("data-code"),
                    text: $el.attr("data-text"),
                    label: $el.attr("data-label"),
                    next: $el.attr("data-next")
                };
                parmes.type === "year" && parmes.code != "" && (parmes.text = parmes.code);
                nodes.push(parmes);
            });

            return nodes;
        },

        open: function () {
            var self = this,
                dialogHeight = self.$selectDialog.height(),
                dialogWidth = self.$selectDialog.width(),
                containerHeight = self.opts.infoQueryWrap.height(),
                containerWidth = self.opts.infoQueryWrap.width();

            self.opts.infoQueryWrap.block({
                message: self.$selectDialog,
                css: {
                    top: (containerHeight - dialogHeight) / 2 + 'px',
                    left: (containerWidth - dialogWidth) / 2 + 'px',
                    width: dialogWidth + 'px',
                    height: dialogHeight + 'px',
                    cursor: 'auto',
                    border: "0",
                    backgroundColor: "transparent"
                }
            });
        },

        close: function (obj) {
            var self = this;

            obj ? obj.unblock() : $.unblock();
        },

        failed: function (msg) {

            msg ? alert(msg) : alert(trans["147"]);
        }

    }

    return VsnSearch;
})