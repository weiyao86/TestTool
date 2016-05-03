define(["globalConfig", "ajax","track", "jqExtend", "json2", "uploadify"], function (globalConfig, ajax,track) {

    var deleteOrderUrl = globalConfig.actions.deleteOrder,
        saveOrderUrl = globalConfig.actions.saveOrder,
        exportSaveOrderUrl = globalConfig.actions.exportSaveOrder,
        saveAsOrderUrl = globalConfig.actions.saveAsOrder,
        createNewOrderUrl = globalConfig.actions.createNewOrder,
        sessionId = globalConfig.context.sessionId,
        uploadifySwf = globalConfig.context.uploadifySwfUrl,
        importOrderUrl = globalConfig.actions.importOrderUrl,
        orderManagerUrl = globalConfig.actions.orderManager,
        orderDetailUrl = globalConfig.actions.orderDetail,
        auth = globalConfig.context.auth,
        dealerGroup = globalConfig.context.dealerGroup,
        deleteOrderUrl = globalConfig.actions.deleteOrder,
        exportOrderUrl = globalConfig.actions.exportOrder,
        trans = globalConfig.trans;

    var defaultOpts = {
        callbacks: {
            onUploadSuccess: null,
            onExported: null
        }
    };

    var OperationOrder = function (options) {
        this.opts = $.extend({}, defaultOpts, options || {});
        this.init();
    };

    OperationOrder.prototype = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.bindEvent();

            window.setTimeout(function () {
                self.initUplaodify();
            }, 10);
        },

        bindDomEls: function () {
            var self = this;

            self.$grid = $("#order-grid");
            self.$modelCode = $("#model-code");
            self.$orderBtnWrap = $("#order-btn-wrap");
            self.$orderChoiceWrap = $("#order-choice");
            self.$uploadfile = $("#import-order");
            self.$userAds = $("#user-address");
            self.$orderImportDesc = $("#order_export_desc");
            self.$report = self.$orderImportDesc.find("textarea[data-field='result']");
            self.$reportClose = self.$orderImportDesc.find("[data-field='close-report']");
            self.$statusOrder = $("#status_order");
            self.isExported = false;
        },

        bindEvent: function () {
            var self = this;

            self.$orderBtnWrap.on("click", "[data-operation]", function (e) {
                var operation = $(e.target).attr("data-operation");

                switch (operation) {
                    case "save-as-order":
                        self.saveAsOrder();
                        
                        break;
                    case "delete-order":
                        self.deleteOrder();
                        break;
                    case "save-order":
                        self.saveOrder();
                        break;
                    case "export-order":
                        self.exportOrder();
                        break;
                    case "create-order":
                        self.createNewOrder();
                        break;
                    default:
                        break;
                }
            });

            self.$reportClose.on("click", function () {
                $.unblockUI();
            });
        },

        saveAsOrder: function () {
            var self = this,
                params = { "orderCode": self.$modelCode.text() };

            ajax.invoke({
                url: saveAsOrderUrl,
                data: JSON.stringify(params),
                contentType: "application/json",
                success: function (root) {
                    alert(trans['176']);
                    window.location.href = orderDetailUrl + "&orderCode=" + root.Data;
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
            track.publish("order-list", "另存为新订单", "click", "save", params);
        },

        deleteOrder: function () {
            var self = this,
                params = { "orderCode": self.$modelCode.text() };
            if (confirm(trans["153"])) {
                ajax.invoke({
                    url: deleteOrderUrl,
                    data: JSON.stringify(params),
                    contentType: "application/json",
                    success: function (root) {
                        alert(trans['177']);
                        window.location.reload(orderManagerUrl);
                    },
                    failed: function (error) {
                        alert(error.reason);
                    }
                });
                track.publish("order-list", "删除订单", "click", "save", params);
            }
        },

        saveOrder: function () {
            var self = this,
                params = self.getSaveParams();

            ajax.invoke({
                url: saveOrderUrl,
                data: JSON.stringify(params),
                contentType: "application/json",
                success: function (root) {
                    alert(trans['162']);
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
            track.publish("order-list", "保存订单", "click", "save", params);
        },

        exportOrder: function () {
            var self = this,
                params = self.getSaveParams();

            ajax.invoke({
                url: exportSaveOrderUrl,
                data: JSON.stringify(params),
                contentType: "application/json",
                success: function (root) {
                    var url, i=0, parts=[], data = root.Data || [];

                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            parts.push(data[i]['PartNumber']);
                        }
                        self.showReport(trans['11136'] + "\r\n" + parts.join(','));
                    } else {
                        url = exportOrderUrl + "&orderCode=" + self.$modelCode.text();
                        $.downloadFileByUrl(url);
                        if (!self.isExported && typeof self.opts.callbacks.onExported == "function") {
                            self.opts.callbacks.onExported.apply(null, []);
                        }
                        self.$statusOrder.html(trans['11130']);
                        self.isExported = true;
                    }
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
            track.publish("order-list", "导出订单", "click", "export", params);
        },

        createNewOrder: function () {
            var self = this;

            ajax.invoke({
                url: createNewOrderUrl,
                success: function (root) {
                    alert(trans['183']);
                    track.publish("order-list", "创建新订单", "click", "add","OrderCode:" + root.Data);
                    window.location.href = orderDetailUrl + "&orderCode=" + root.Data;
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
        },

        getSaveParams: function () {
            var self = this,
                field,
                value,
                params = {},
                obj = {},
                select = self.$orderChoiceWrap.find("[data-field-name]"),
                delear = self.$userAds.find("ul[data-area]");

            select.each(function (index, el) {
                field = $(el).attr("data-field-name");
                value = $(el).val();
                params[field] = value;
            });

            delear.each(function (index, el) {
                obj = {};
                $(el).find("[data-name]").each(function (i, e) {
                    obj[$(e).attr("data-name")] = $(e).text();
                });
                params[$(el).attr("data-area")] = obj;
            });

            params["Code"] = self.$modelCode.text();

            return params;
        },

        initUplaodify: function () {
            var self = this,
                orderCode = self.$uploadfile.attr("data-order-code");

            self.$uploadfile.uploadify({
                swf: uploadifySwf,
                method: 'POST',
                uploader: importOrderUrl,
                auto: true,
                formData: { sessionId: sessionId, auth: auth, OrderCode: orderCode, DealerGroup: dealerGroup },
                buttonText: trans['130'],
                fileObjName: "file",
                multi: false,
                width: 80,
                height: 22,
                fileDesc: trans['178'],
                fileTypeExts: "*.xls",
                onUploadSuccess: function (file, data, response) {
                    self.uploadSuccess(data);
                    track.publish("order-list", "导入订单", "click", "import");

                },
                onUploadError: function (file, errorCode, errorMsg, errorString) {
                    alert(trans['149'] + '：' + file.name + trans['150'] + ': ' + errorString);
                }
            });
        },

        uploadSuccess: function (data) {
            var self = this,
                data = JSON.parse(data);

            if (data.IsSuccess) {
                if (typeof self.opts.callbacks.onUploadSuccess === "function") {
                    self.opts.callbacks.onUploadSuccess.apply(self, []);
                }
                alert(trans['183']);
            } else {
                alert(data.ErrorMessage);
            }
        },

        showReport: function (data) {
            var self = this,
                targetW = self.$orderImportDesc.width(),
                targetH = self.$orderImportDesc.height(),
                l = ($(window).width() - targetW) / 2,
                t = ($(window).height() - targetH) / 2;

            self.$report.val(data).text(data);

            $.blockUI({
                message: self.$orderImportDesc,
                css: {
                    cursor: 'default',
                    background: 'transparent',
                    textAlign: 'left',
                    border: 'none',
                    width: targetW,
                    height: targetH,
                    left: l,
                    top: t
                }
            });
        }
    }

    return OperationOrder;

});