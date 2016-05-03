define(["globalConfig", "ajax", "mustache"],
    function (globalConfig, ajax, Mustache) {

        var url = globalConfig.actions.noticeAllUrl;

        var Notice = function () {

            this.init();
        }

        Notice.prototype = {

            init: function () {
                var self = this;

                self.bindDomEls();
                self.bindTemplate();
                self.request();
            },

            bindDomEls: function () {
                var self = this;

                self.$noticeWrap = $("#notice-item-common");
                self.$noticeTemplate = $("#notice-item-template");

                self.$bulletinWrap = $("#bulletin-item-common");
                self.$bulletinTemplate = $("#bulletin-item-template");
            },

            bindTemplate: function () {
                var self = this;

                self.noticeTemplate = self.$noticeTemplate.html();

                self.bulletinTemplate = self.$bulletinTemplate.html();
            },

            request: function () {
                var self = this;

                ajax.invoke({
                    url: url,
                    type: "get",
                    contentType: "application/json",
                    success: function (root) {
                        self.buildData(root.Data);
                    },
                    failed: function (error) {
                        alert(error.reason);
                    }
                });
            },

            buildData: function (data) {
                var self = this,
                    finaliyData = {},
                    i = 0;

                for (var key in data) {
                    if (data[key].Details[0]) {
                        finaliyData["is" + key] = true;
                        finaliyData[key] = data[key].Details[0]
                    } else {
                        finaliyData["is" + key] = false;
                    }
                }

                self.render(finaliyData);
            },

            render: function (data) {
                var self = this,
                    test = "",
                    noticeHtml = Mustache.render(self.noticeTemplate, { Messages: data.Messages || [] }),
                    bulletinHtml = Mustache.render(self.bulletinTemplate, { Bulletins: data.Bulletins || [] });

                self.$noticeWrap.html(noticeHtml);
                self.$bulletinWrap.html(bulletinHtml);
            }
        }

        return Notice;

    })