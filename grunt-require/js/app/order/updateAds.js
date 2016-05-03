define(["globalConfig", "ajax", "mustache","track", "blockUI", "amplify"], function (globalConfig, ajax, Mustache,track) {

    var defaultOpts = {
        wrap: "edit-address"
    },
        trans = globalConfig.trans;

    var UpdateAds = function (options) {

        this.opts = $.extend({}, defaultOpts, options || {});
        this.init();
    }

    UpdateAds.prototype = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.bindEvent();
            self.bindTemplate();
        },

        bindDomEls: function () {
            var self = this;

            self.$wrap = $("#" + self.opts.wrap);
            self.$useNewAds = self.$wrap.find("[data-action='use-new-address']");
            self.$writeAds = self.$wrap.find("[data-area='edit']");
            self.$userInfo = self.$wrap.find("[data-area='list']");
            self.$save = self.$wrap.find("[data-action='save']");
            self.$modelCode = $("#model-code");
            self.$userAds = $("#user-address");
            self.$editOperation = self.$wrap.find("[data-area='edit-operation']")
            self.$btnAdsOperation = self.$wrap.find("[data-area='btn-operation']");
            self.$purchaser = self.$userAds.find("[data-area='Purchaser']");
            self.$receipt = self.$userAds.find("[data-area='Receipt']");
            self.$tip = $("#tip");
        },

        bindEvent: function () {
            var self = this;

            self.$useNewAds.on("click", function () {
                self.userNewAds();
            });

            self.$userInfo.on("click", "a[data-action],input[data-action]", function (e) {
                var action = $(e.target).attr("data-action"),
                    params = { "Id": $(e.target).closest("tr").attr("data-key") };

                switch (action) {
                    case "SetDefault":
                        self.loadList(action, params);
                        break;
                    case "Update":
                        self.updataAds($(e.target), action);
                        break;
                    case "Delete":
                        if (confirm(trans['182'])) self.loadList(action, params);
                        break;
                    case "check":
                        self.checkUserInfo();
                        break;
                    default:
                        break;
                }
            });

            self.$wrap.on("click", "[data-action='close']", function () {
                self.close();
            });

            self.$editOperation.on("click", "[data-action]", function (e) {
                action = $(e.target).attr("data-action");

                switch (action) {
                    case "edit-save":
                        self.saveNewAds();
                        break;
                    case "edit-close":
                        self.closeNewAds();
                        break;
                    default:
                        break;
                }
            });

            self.$save.on("click", function () {
                self.saveAllInfo();
            });

        },

        bindTemplate: function () {
            var self = this;

            self.template = self.$userInfo.find("script").html();
            self.purchaserTemplate = self.$purchaser.find("script").html();
            self.receiptTemplate = self.$receipt.find("script").html();
        },

        userNewAds: function () {
            var self = this;

            self.clear();
            self.$editOperation.show();
            self.$btnAdsOperation.hide();
            self.$writeAds.show();
        },

        checkUserInfo: function () {
            var self = this;

            self.$editOperation.hide();
            self.$btnAdsOperation.show();
            self.$writeAds.hide();
        },

        updataAds: function ($sender, action) {
            var self = this,
                params = self.getSingleData($sender.closest("tr")),
                writeAds = self.$writeAds,
                radio = self.$wrap.find("[type='radio']");

            self.$editOperation.show();
            self.$btnAdsOperation.hide();
            radio.removeAttr("checked");
            $sender.closest("tr").find("[type='radio']").attr("checked", "checked");

            writeAds.show().find("input[data-field]").each(function (index, el) {
                field = $(el).attr("data-field");
                writeAds.find("[data-field='" + field + "']").val(params[field]);
            });
        },

        saveNewAds: function () {
            var self = this, type,
                params = self.getSingleData(self.$writeAds);

            params.Id ? type = "Update" : type = "Insert";

            if (!self.validate()) return;

            ajax.invoke({
                url: globalConfig.actions[self.type + type],
                data: JSON.stringify(params),
                contentType: "application/json",
                success: function (root) {
                    self.saveNewAdsSuccess();
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
        },

        saveNewAdsSuccess: function () {
            var self = this;

            self.$writeAds.hide();
            self.clear();
            self.loadUserInfo(self.url, self.key);
            self.$editOperation.hide();
            self.$btnAdsOperation.show();
            self.$useNewAds.removeAttr("checked");
        },

        closeNewAds: function () {
            var self = this;

            self.clear();
            self.$tip.hide();
            self.$writeAds.hide();
            self.$editOperation.hide();
            self.$btnAdsOperation.show();
            self.$useNewAds.removeAttr("checked");
            self.loadUserInfo(self.url, self.key);
        },

        saveAllInfo: function () {
            var self = this,
                params = self.extractSaveParams();

            if (params) {
                params[0].orderCode = self.$modelCode.text();
                ajax.invoke({
                    url: globalConfig.actions[self.type + "Update"],
                    data: JSON.stringify({ model: params[0] }),
                    contentType: "application/json",
                    success: function (root) {
                        self.renderDelear(params);
                    },
                    failed: function (error) {
                        alert(error.reason);
                    }
                });
            }

            self.close();
        },

        loadList: function (action, params) {
            var self = this;

            ajax.invoke({
                url: globalConfig.actions[self.type + action],
                data: JSON.stringify(params),
                contentType: "application/json",
                success: function (root) {
                    self.loadUserInfo(globalConfig.actions[self.type + "Load"]);
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
        },

        loadUserInfo: function (url, key) {
            var self = this;

            ajax.invoke({
                url: url,
                contentType: "application/json",
                success: function (root) {
                    self.data = root.Data;
                    self.render(root.Data, key);
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
        },

        render: function (data, key) {
            var self = this, i = 0, item;
            if (key) {
                for (; item = data[i]; i++) {
                    if (item.Id == key) {
                        data[i].IsDefault = true;
                    } else {
                        data[i].IsDefault = false;
                    }
                }
            }
            var html = Mustache.render(self.template, { records: data });

            self.$userInfo.html(html);
        },

        changeEditTitle: function (field) {
            var self = this,
                title = self.$wrap.find("h3 > b");

            self.$wrap.attr("data-field", field);

            if (field === "Purchaser") {
                title.text(trans['116']);
                track.publish("order-list", "下单人-修改或使用新地址", "click", "view");

            } else {
                title.text(trans['118']);
                track.publish("order-list", "收货人-修改或使用新地址", "click", "view");
            }
        },

        extractSaveParams: function () {
            var self = this,
                idx,
                radio = self.$wrap.find("input[type='radio']"),
                selectionRadio;

            if (self.$wrap.find("input:checked").length === 0) {
                self.close();
                return;
            }

            radio.each(function (i, el) {
                if ($(el).attr("checked") === "checked")
                    idx = $(el).attr("data-id");
            });

            return self.currentData(idx);
        },

        currentData: function (id) {
            var self = this, arr = [], i = 0;

            for (; i < self.data.length; i++) {
                if (self.data[i].Id === parseInt(id)) {
                    arr.push(self.data[i]);
                    return arr;
                }
            }
        },

        getSingleData: function (obj) {
            var self = this,
                params = {},
                child = obj.find("[data-field]");

            child.each(function (index, el) {
                field = $(el).attr("data-field");
                val = $(el).text() || $(el).val();
                params[field] = val;
            });

            return params;
        },

        renderDelear: function (data) {
            var self = this, output;

            if (self.type === "purchaser") {
                output = Mustache.render(self.purchaserTemplate, { records: data });
                self.$purchaser.html(output);
            } else {
                output = Mustache.render(self.receiptTemplate, { records: data });
                self.$receipt.html(output);
            }
        },

        validate: function () {
            var self = this,
                emailRegExp = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+(((\.|-)|_)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                postVal = self.$writeAds.find("[data-field='PostCode']").val(),
                emailVal = self.$writeAds.find("[data-field='Mail']").val(),
                postRegExp = /^\d{6}$/;

            if (!self.eachNewInfo()) {
                self.$tip.show().text(trans['179']);
                return false;
            } else if (!postRegExp.test(postVal)) {
                self.$tip.show().text(trans['180']);
                return false;
            } else if (!emailRegExp.test(emailVal)) {
                self.$tip.show().text(trans['181']);
                return false;
            } else {
                self.$tip.hide();
                return true;
            }
        },

        eachNewInfo: function () {
            var self = this,
                num = 0,
                input = self.$writeAds.find("input[data-field][data-validate]");

            input.each(function (index, el) {
                if ($(el).val().length === 0) {
                    num++;
                    return false;
                }
            });

            if (num === 0) {
                return true;
            }
        },

        saveSuccess: function () {
            var self = this;

            self.clear();
            self.$writeAds.hide();
            self.close();
            amplify.publish("load-delear");
        },

        clearSelectRadio: function () {
            var self = this;

            self.$wrap.find("input[type='radio']").removeAttr("checked");
        },

        clear: function () {
            var self = this,
                textBox = self.$writeAds.find("input");

            textBox.val("");
        },

        open: function (field, $sender) {
            var self = this,
                width = self.$wrap.width(),
                height = self.$wrap.height();

            self.url = $sender.attr("data-url");
            self.key = $sender.attr("data-key")
            self.type = field.toLowerCase();

            $(document).on("keyup.editAddress", function (e) {
                if (e.keyCode === 27) self.close();
            })

            self.changeEditTitle(field);
            self.loadUserInfo(self.url, self.key);
            self.clearSelectRadio();

            $.blockUI({
                message: self.$wrap,
                css: {
                    left: ($(window).width() - width) / 2 + "px",
                    top: ($(window).height() - height) / 2 + "px",
                    width: width + 'px',
                    height: height + 'px',
                    cursor: 'auto',
                    border: "0"
                }
            });
        },

        close: function () {
            var self = this;

            $.unblockUI();
            self.clear();
            self.$tip.hide();
            self.$writeAds.hide();
        }
    }

    return UpdateAds;

});