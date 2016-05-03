
define(["globalConfig", "ajax", "mustache", "amplify"], function (globalConfig, ajax, Mustache) {

    var initDelearUrl = globalConfig.actions.delearUrl;

    var defaultOpts = {
        callbacks: {
            onClicked: null
        }
    }

    var Delear = function (options) {

        this.opts = $.extend({}, defaultOpts, options || {});
        this.init();
    }

    Delear.prototype = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.bindTemplate();
            self.bindEvent();
            self.loadDelear();
            self.subscribe();
        },

        bindDomEls: function () {
            var self = this;

            self.$modelCode = $("#model-code");
            self.$userAds = $("#user-address");
            self.$purchaser = self.$userAds.find("[data-area='Purchaser']");
            self.$receipt = self.$userAds.find("[data-area='Receipt']");
        },

        bindTemplate: function () {
            var self = this;

            self.purchaserTemplate = self.$purchaser.find("script").html();
            self.receiptTemplate = self.$receipt.find("script").html();
        },

        bindEvent: function () {
            var self = this;

            self.$userAds.on("click", "[data-action='edit-address']", function (e) {
                self.clicked($(e.target).attr("data-field"), $(e.target));
            });
        },

        subscribe: function () {
            var self = this;

            self.loadDelear();
        },

        loadDelear: function () {
            var self = this,
                params = { "orderCode": self.$modelCode.text() };

            ajax.invoke({
                url: initDelearUrl,
                data: JSON.stringify(params),
                contentType: "application/json",
                success: function (root) {
                    self.renderDelearData(root.Data);
                },
                failed: function (error) {
                    self.failed(error.reason);
                }
            });
        },

        clicked: function (field, $sender) {
            var self = this,
                onClicked = self.opts.callbacks.onClicked;

            if (typeof onClicked === 'function') {
                onClicked.apply(null, [field, $sender]);
            }
        },

        renderDelearData: function (data) {
            var self = this,
                purchaserHtml = Mustache.render(self.purchaserTemplate, { records: data.Purchaser }),
                receiptHtml = Mustache.render(self.receiptTemplate, { records: data.Receipt });

            self.$purchaser.html(purchaserHtml);
            self.$receipt.html(receiptHtml);
        }
    }

    return Delear;

});