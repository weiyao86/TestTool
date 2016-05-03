
define(["globalConfig", "ajax", "grid", "mustache", "track"], function (globalConfig, ajax, Grid, Mustache, track) {

    var superSessionSearchUrl = globalConfig.actions.superSessionSearch;

    var defaultOpts = {
        callbacks: {
            onSearch: null
        }
    },
     trans = globalConfig.trans;

    var SuperSession = function (options) {

        this.opts = $.extend({}, defaultOpts, options || {});

        this.init();

    };

    SuperSession.prototype = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.bindTemplate();
            self.bindEvent();
        },

        bindDomEls: function () {
            var self = this;

            self.$superSessionWrap = $("#super-session-search");
            self.$superSessionGrid = $("#super-session-search-grid");
            self.$partNumber = $("#super-session-partNumber");
            self.$btnSearch = $("#super-session-search-btn-filter");
            self.$btnClear = $("#super-session-search-btn-clear");
            self.$filter = $("#super-session-filter");
        },

        bindTemplate: function () {
            var self = this;

            self.superSessionTemplate = self.$superSessionGrid.find("script").html();
        },

        bindEvent: function () {
            var self = this;

            self.$btnSearch.click(function () {
                self.validate();
            });

            self.$partNumber.on("keyup", function (e) {
                if (e.keyCode === 13) {
                    self.validate(1);

                }
            });

            self.$superSessionGrid.on("click", "[data-action='goToPartNumber']", function (e) {
                self.onSearchGoTo($(e.target));
            });

            self.$btnClear.click(function () {
                self.$partNumber.val("");
            });
        },

        onSearchGoTo: function ($sender) {
            var self = this,
                onSearch = self.opts.callbacks.onSearch,
                params = { "PartNumber": $sender.text() };

            if (typeof onSearch === "function") {
                onSearch.apply(null, [params]);
            }
        },

        interfaceSearch: function (input) {
            var self = this;
            track.publish("header", "外链传入参数替换查询", "click", "view", input);
            self.$partNumber.val(input);
            self.validate();

        },

        validate: function (flag) {
            var self = this,
                partNumber = self.$partNumber.val(),
                evt = "click";
            if (flag == 1) evt = "enter";
            if ($.trim(partNumber).length === 0) {
                return;
            } else {
                self.loadData();
            }
            track.publish("supersession", "查询", evt, "view", "PartNumber:" + self.$partNumber.val());
        },

        loadData: function () {
            var self = this,
                params = { "PartNumber": self.$partNumber.val() };

            ajax.invoke({
                url: superSessionSearchUrl,
                contentType: "application/json",
                data: JSON.stringify(params),
                success: function (root) {
                    if (root.IsSuccess) {
                        self.finishLoaded(root.Data.Details || [], params);
                        if (!root.Data.HasData) {
                            alert(trans["11135"]);
                        }
                    } else {
                        self.failed(root.ErrorMessage);
                    }
                },
                failed: function (error) {
                    self.failed(error.reason);
                }
            });

        },

        finishLoaded: function (data, params) {
            var self = this, i = 0, item;

            for (; item = data[i]; i++) {
                item["isLinkDisabled"] = item.IsPartNumber && item.IsEpc;
                $.trim(item["PartNumber"].toLowerCase()) == $.trim(params.PartNumber.toLowerCase()) && (item["isBoldP"] = true);
                $.trim(item["ReplacePartNumber"].toLowerCase()) == $.trim(params.PartNumber.toLowerCase()) && (item["isBoldR"] = true);
            }

            self.render(data);
        },

        render: function (data) {
            var self = this,
                output = Mustache.render(self.superSessionTemplate, { records: data });

            self.$superSessionGrid.html(output);

        },

        hideSuperSession: function () {
            var self = this;

            self.$superSessionWrap.hide();
        },

        fillFilter: function (params) {
            var self = this;

            for (key in params) {
                self.$filter.find("[data-field='" + key + "']").val(params[key]);
            }

            self.loadData();
        },

        clear: function () {
            var self = this;

            self.$partNumber.val("");
        },

        failed: function (msg) {

            msg ? alert(msg) : alert(trans["147"]);
        }

    }

    return SuperSession;
})